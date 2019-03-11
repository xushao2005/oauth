package com.cmhb.module.auth.domain;

import com.baomidou.mybatisplus.annotations.TableName;
import com.cmhb.domain.BaseEntity;
import com.cmhb.module.auth.enums.ResourceType;
import com.cmhb.module.auth.model.ControlModel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.apache.commons.lang.StringUtils;

import java.io.Serializable;

/**
 * <p>
 * <p>
 * </p>
 *
 * @author ${author}
 * @since 2017-08-07
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@TableName("auth_control")
public class Control extends BaseEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    private String name;
    //控件类型 MENU/BUTTON
    private String type;
    // 上级菜单
    private long controlPId;
    // 上级面包屑
    private long breadPId;
    private String icon;
    private String router;
    //当前路径匹配规则，补充菜单路径
    private String matchRouter;
    private long clientId;
    private int seq;

    public static class ControlBuilder {
        private final long id;
        private final String name;
        //控件类型 MENU/BUTTON
        private final String type;
        // 上级菜单
        private final long controlPId;
        // 上级面包屑
        private final long breadPId;
        private final String icon;
        private final String router;
        //当前路径匹配规则，补充菜单路径
        private final String matchRouter;
        private long clientId;
		private int seq;
        private int status;

        public ControlBuilder(ControlModel menuModel) {
            this.id = menuModel.getId();
            this.name = menuModel.getName();
            this.type = StringUtils.lowerCase(menuModel.getType());
            if (ResourceType.BUTTON.name().equals(type)) {
                this.controlPId = -1;
            } else {
                this.controlPId = menuModel.getControlPId();
            }
            this.breadPId = menuModel.getBreadPId();
            this.icon = menuModel.getIcon();
            this.router = menuModel.getRouter();
            this.seq = menuModel.getSeq();
            this.matchRouter = menuModel.getMatchRouter();
        }

        public ControlBuilder clientId(long clientId) {
            this.clientId = clientId;
            return this;
        }

        public ControlBuilder status(int status) {
            this.status = status;
            return this;
        }

        public Control build() {
            Control control = new Control();
            control.setId(id);
            control.setName(name);
            control.setType(type);
            control.setControlPId(controlPId);
            control.setBreadPId(breadPId);
            control.setIcon(icon);
			control.setRouter(router);
			control.setSeq(seq);
            control.setMatchRouter(matchRouter);
            control.setClientId(clientId);
            control.setStatus(status);
            return control;
        }
    }
}
