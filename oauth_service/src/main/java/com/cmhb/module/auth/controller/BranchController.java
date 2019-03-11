package com.cmhb.module.auth.controller;

import com.baomidou.mybatisplus.plugins.Page;
import com.cmhb.common.exceptions.BusinessException;
import com.cmhb.common.utils.BeanReflactUtil;
import com.cmhb.common.utils.StringHelper;
import com.cmhb.common.utils.TrimUtils;
import com.cmhb.enums.EntityTypeEnum;
import com.cmhb.enums.MethodTypeEnum;
import com.cmhb.module.auth.domain.Branch;
import com.cmhb.module.auth.domain.BranchChangeLog;
import com.cmhb.module.auth.model.BranchModel;
import com.cmhb.module.auth.service.BranchChangeLogService;
import com.cmhb.module.auth.service.BranchService;
import com.cmhb.module.auth.service.DomesticAreaService;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author ${author}
 * @since 2017-08-30
 */
@RestController
@RequestMapping("/branchs")
@Slf4j
@SuppressWarnings("rawtypes")
public class BranchController {
	private static Pattern TWO_NUMBER_PATTERN = Pattern.compile("\\w{2}");

	@Resource
	private BranchService branchService;
	@Resource
	private DomesticAreaService areaTypeService;
	@Resource
	private BranchChangeLogService branchChangeLogService;

	@GetMapping("/page")
	public ResponseEntity list(Page<Branch> page, BranchModel branchModel) {
		// todo MP逻辑删除
		Map<String, Object> params = BeanReflactUtil.fieldsToMap(branchModel);
		List<Branch> branchs = branchService.selectByMap(params);
		return new ResponseEntity<>(branchs, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public Branch view(@PathVariable("id") Long id) {
		return branchService.findById(id);
	}

	@PutMapping
	public ResponseEntity update(@RequestBody Branch branch) {
		if (branch == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		}
		TrimUtils.trimObj(branch);
		Branch branch_ = branchService.findById(branch.getId());
		if (branch_ == null) {
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		}
		branch.setStatusId(branch_.getStatusId());
		branch.setStatus(branch_.getStatus());
		branch.setAddTime(branch_.getAddTime());
		String areaCode = branch.getAreaCode() != null ? branch.getAreaCode() : "";
		if (!areaCode.equals(branch_.getArea())) {
			branch.setArea(areaTypeService.selectByCode(areaCode));
		} else {
			branch.setArea(areaCode);
			branch.setAreaCode(areaTypeService.selectByName(areaCode));
		}
		if (!branch.getSettle() && StringUtils.isEmpty(branch.getSettleCompanyCode())) {
			throw new BusinessException("必须指定结算公司");
		}
		if (branch.getSettle()) {
			branch.setSettleCompanyCode(null);
		} else {
			//不能以自身为所属结算公司
			if (branch.getSettleCompanyCode().equalsIgnoreCase(branch.getCode())) {
				throw new BusinessException("所属结算公司错误");
			}
			//验证选择的所属结算公司是否是结算公司
			Branch settleCompany = branchService.findBranchByCode(branch.getSettleCompanyCode());
			if (Boolean.FALSE.equals(settleCompany.getSettle())) {
				throw new BusinessException("所属结算公司错误, 该公司不是结算公司");
			}
//            结算公司更改为非结算公司, 更新以该分公司为结算公司的其它公司
			branchService.updateSettleCompany(branch.getCode(), branch.getSettleCompanyCode());
		}
		//客户所在区设置默认值
		if (StringUtils.isBlank(branch.getIsBelong())) {
			branch.setIsBelong("01");
		} else {
			Matcher matcher = TWO_NUMBER_PATTERN.matcher(branch.getIsBelong());
			if (!matcher.matches()) {
				throw new BusinessException("客户所在区错误, 必须为数字");
			}
		}
		boolean ret = branchService.updateAllColumnById(branch);
		if (ret) {
			val changelog = new BranchChangeLog();
			changelog.setId(StringHelper.getPkid());
			changelog.setEntity(EntityTypeEnum.BRANCH.value());
			changelog.setType(MethodTypeEnum.UPDATE.value());
			changelog.setBusinessCode(branch.getCode());
			changelog.setStatus(0);
			branchChangeLogService.insert(changelog);
		}
		return new ResponseEntity(HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity create(@RequestBody Branch branch) {

		TrimUtils.trimObj(branch);
		branch.setArea(areaTypeService.selectByCode(branch.getAreaCode()));

		branch.setStatus(1);
		branch.setStatusId(true);

		if (branch.getSettle() == null) {
			branch.setSettle(false);
		}

		if (!branch.getSettle()) {
			if (StringUtils.isEmpty(branch.getSettleCompanyCode())) {
				throw new BusinessException("必须指定结算公司");
			}
			//验证选择的所属结算公司是否是结算公司
			Branch settleCompany = branchService.findBranchByCode(branch.getSettleCompanyCode());
			if (!settleCompany.getSettle()) {
				throw new BusinessException("所属结算公司错误, 该公司不是结算公司");
			}
		}

		if (StringUtils.isBlank(branch.getAreaCode())) {
			branch.setAreaCode("01");
		}
		if (StringUtils.isBlank(branch.getIsBelong())) {
			branch.setIsBelong("01");
		} else {
			Matcher matcher = TWO_NUMBER_PATTERN.matcher(branch.getIsBelong());
			if (!matcher.matches()) {
				throw new BusinessException("客户所在区错误, 必须为数字");
			}
		}

		boolean i = branchService.insert(branch);
		if (i) {
			val changelog = new BranchChangeLog();
			changelog.setId(StringHelper.getPkid());
			changelog.setEntity(EntityTypeEnum.BRANCH.value());
			changelog.setType(MethodTypeEnum.NEW.value());
			changelog.setBusinessCode(branch.getCode());
			changelog.setStatus(0);
			branchChangeLogService.insert(changelog);

			return new ResponseEntity(HttpStatus.OK);
		}
		return new ResponseEntity(HttpStatus.NOT_FOUND);
	}

	@DeleteMapping("/{id}")
	public void remove(@PathVariable("id") Long id) {
		branchService.deleteById(id);
	}

	@GetMapping("/unique/code")
	public boolean uniqueCode(@RequestParam(required = false) Long id,
							  @RequestParam String code) {
		return branchService.unique(id, code, null, null);
	}

	@GetMapping("/unique/name")
	public boolean uniqueName(@RequestParam(required = false) Long id,
							  @RequestParam String name) {
		return branchService.unique(id, null, name, null);
	}

	@GetMapping("/unique/warehouseCode")
	public boolean uniqueWarehouseCode(@RequestParam(required = false) Long id,
									   @RequestParam String warehouseCode) {
		return branchService.unique(id, null, null, warehouseCode);
	}
}
