package com.cmhb.module.auth.controller;

import com.cmhb.common.utils.BeanMapper;
import com.cmhb.module.auth.domain.Client;
import com.cmhb.module.auth.domain.Control;
import com.cmhb.module.auth.enums.ResourceType;
import com.cmhb.module.auth.model.ControlModel;
import com.cmhb.module.auth.service.ClientService;
import com.cmhb.module.auth.service.MenuService;
import com.cmhb.module.oauth2.model.ClientModel;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * <p>
 * ${table.comment} 前端控制器
 * </p>
 *
 * @author ${author}
 * @since 2017-05-24
 */
@RestController
@RequestMapping("/buzApplication")
public class BuzApplicationController {
    @Autowired
    private ClientService clientService;
	@Resource
	private MenuService menuService;

    @GetMapping
    public List pageList(@ModelAttribute ClientModel searchClient) {
        Map<String, Object> params = new HashMap<String, Object>();
        //todo 筛选

        List<Client> clients = clientService.findList(params);
        return clients;

    }

	@GetMapping("/{id}")
	public Client view(@PathVariable Long id) {
		Client client = clientService.selectById(id);
		return client;
	}

	@GetMapping("/{id}/controls")
	public List<ControlModel> controls(@PathVariable Long id) {
		List<Control> controls = menuService.findControlByClient(id);
		return controls.stream().map(this::convert).sorted(new ControlModel.Comparator()).collect(Collectors.toList());
	}


    @PostMapping
    public void create(@RequestBody ClientModel clientDto) {
        //todo 数据验证
        clientService.createClient(clientDto);

    }

    @PutMapping
    public void update(@RequestBody ClientModel clientDto) {
        //todo 数据验证
        Client client = BeanMapper.map(clientDto, Client.class);
        clientService.updateBasic(client);
    }

    @DeleteMapping("/{id}")
    public void remove(@NonNull @PathVariable("id") Long id) {
        clientService.deleteById(id);
    }

    /**
     * 验证应用信息合法性
     *
     * @param redirectUrl 回调地址
     *
     * @return
     */
    @GetMapping("/redirectUrl/validate")
    public boolean isValidApplication(@RequestParam(required = false) Long id,
                                      @RequestParam String redirectUrl) {
        if (id == null) {
            return clientService.isRedirectUrlUnique(redirectUrl);
        } else {
            return clientService.isRedirectUrlUnique(id, redirectUrl);
        }
    }

	private ControlModel convert(Control control) {
		ControlModel controlModel = BeanMapper.map(control, ControlModel.class);

		if (ResourceType.BUTTON.name().equals(control.getType())) {
			controlModel.setControlPId(-1L);
		}
		return controlModel;
	}
}
