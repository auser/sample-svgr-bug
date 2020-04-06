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
export function Accommodation(props: Props) {
  return <svg width={24} height={24} viewBox="0 0 24 24" {...props}><path d="M6.1667 13.2517c-.9205 0-1.6667-.7462-1.6667-1.6667 0-.9205.7462-1.6667 1.6667-1.6667.9204 0 1.6666.7462 1.6666 1.6667 0 .9205-.7462 1.6667-1.6666 1.6667zm3.3333 0a.4167.4167 0 0 1-.4167-.4167V9.7867a.6942.6942 0 0 1 .6742-.6934c3.9925-.115 7.4367 1.075 9.1508 3.0034a.6942.6942 0 0 1-.5191 1.155H9.5zM21.1667 8.46A.8333.8333 0 0 1 22 9.2933V17.21a.8333.8333 0 1 1-1.6667 0v-.8333a.4167.4167 0 0 0-.4166-.4167H4.0833a.4167.4167 0 0 0-.4166.4167v.8333A.8333.8333 0 0 1 2 17.21V6.7933a.8333.8333 0 1 1 1.6667 0v7.0834c0 .23.1865.4166.4166.4166h15.8334a.4167.4167 0 0 0 .4166-.4166V9.2933a.8333.8333 0 0 1 .8334-.8333z" /></svg>;
}
export default Accommodation;