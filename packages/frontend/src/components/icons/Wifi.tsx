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
export function Wifi(props: Props) {
  return <svg width={24} height={24} viewBox="0 0 24 24" {...props}><path d="M4.8665 10.1334c3.9425-3.9303 10.3218-3.9303 14.2643 0 .2107.2096.3289.4947.3283.792v.026c-.0094.6092-.5073 1.0975-1.1166 1.095a1.1193 1.1193 0 0 1-.7928-.3283c-3.067-3.0584-8.0306-3.0584-11.0976 0-.4398.425-1.139.4191-1.5715-.0132-.4326-.4323-.4389-1.1315-.0141-1.5715zm16.805-3.434A1.1212 1.1212 0 1 1 20.086 8.285c-4.4692-4.4576-11.7029-4.4576-16.172 0-.4378.4379-1.1477.4379-1.5856 0-.4379-.4378-.4379-1.1478 0-1.5856 5.3452-5.3325 13.998-5.3325 19.3432 0zm-7.5343 5.3317a6.4465 6.4465 0 0 1 2.4564 1.531 1.122 1.122 0 0 1-.7919 1.9147 1.1184 1.1184 0 0 1-.7901-.3264c-.053-.0494-.1148-.0897-.1704-.139-1.6786-1.5154-4.249-1.4544-5.8537.139a1.1184 1.1184 0 0 1-.7928.3291 1.121 1.121 0 0 1-.792-1.9139 6.504 6.504 0 0 1 6.7345-1.5345zM12 21.3027c-1.2383 0-2.2421-1.0038-2.2421-2.242 0-1.2384 1.0038-2.2422 2.242-2.2422 1.2384 0 2.2422 1.0038 2.2422 2.2421 0 1.2383-1.0038 2.2421-2.2421 2.2421z" /></svg>;
}
export default Wifi;