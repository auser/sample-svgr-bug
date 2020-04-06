import * as React from "react";
import { Icon } from '../basics/Icon';
interface Props {
  color?: "primary" | "secondary" | "tertiary" | "info" | "success" | "warning" | "critical";
  size?: "small" | "medium" | "large";
  customColor?: string;
  className?: string;
  ariaHidden?: boolean;
  ariaLabel?: string;
  reverseOnRtl?: boolean;
  dataTest?: string;
}
;
export function Accountcircle(props: Props) {
  return <svg width={24} height={24} viewBox="0 0 24 24" {...props}><path d="M13.6944 2.1323C6.9167 1.036 1.036 6.9167 2.1324 13.6944c.6976 4.0867 3.9869 7.4756 8.1732 8.1733 6.7777 1.0964 12.6585-4.7844 11.562-11.5621-.6976-4.0867-4.0865-7.4756-8.1732-8.1733zm-1.495 16.8448h-.299c-2.3922 0-4.585-1.196-5.7811-3.0898.9967-.4984 2.0931-.8971 3.0898-1.2958l.4984-.1993c.1994-.0997.3987-.299.3987-.598.0997-.4984.0997-.9968-.1993-1.3955-.6978-.6977-1.2958-1.5948-1.2958-3.8873 0-1.794 1.196-3.2892 2.9902-3.4885h.4984c1.7941 0 3.2892 1.3954 3.2892 3.0898v.3987c0 2.2925-.6977 3.1896-1.2958 3.8873-.299.3987-.299.897-.1993 1.3954 0 .1994.1993.4984.3987.598l.4984.1994c1.0964.3987 2.0931.7974 3.0898 1.2958-1.2957 1.794-3.2892 2.9902-5.6814 3.0898z" /></svg>;
}
export default Accountcircle;