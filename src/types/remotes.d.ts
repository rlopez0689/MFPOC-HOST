declare module "userWidget/UserWidget" {
  import type { ComponentType } from "react";

  export interface UserWidgetRemoteProps {
    userId?: number;
    tenantId?: string;
    appTheme?: string;
  }

  const UserWidget: ComponentType<UserWidgetRemoteProps>;
  export default UserWidget;
}
