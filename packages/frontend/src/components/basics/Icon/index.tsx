import React from "react"
import styled, { css } from "styled-components"
import { ICON_SIZES, ICON_COLORS } from "./consts"

export type Size = "small" | "medium" | "large"
export type Color =
  | "primary"
  | "secondary"
  | "tertiary"
  | "info"
  | "success"
  | "warning"
  | "critical"

type GetSize = (size: Size) => ({ theme: ThemeProps }) => string

const getSize: GetSize = (size?: string) => ({ theme }) => {
  const tokens = {
    [ICON_SIZES.SMALL]: theme.icons.sizing.small,
    [ICON_SIZES.MEDIUM]: theme.icons.sizing.medium,
    [ICON_SIZES.LARGE]: theme.icons.sizing.large,
  }
  return tokens[size] || tokens[ICON_SIZES.MEDIUM]
}

const getColor = () => ({ theme, color }) => {
  const tokens = {
    [ICON_COLORS.PRIMARY]: theme.color.primary,
    [ICON_COLORS.SECONDARY]: theme.color.secondary,
    [ICON_COLORS.TERTIARY]: theme.color.tertiary,
    [ICON_COLORS.INFO]: theme.color.info,
    [ICON_COLORS.SUCCESS]: theme.color.success,
    [ICON_COLORS.WARNING]: theme.color.warning,
    [ICON_COLORS.CRITICAL]: theme.color.critical,
  }
  return tokens[color]
}

const reverse = ({ reverseOnRtl, theme }) =>
  reverseOnRtl &&
  theme.rtl &&
  css`
    transform: scale(-1, 1);
  `

interface IconProps {
  size?: Size
  color?: Color
  className?: string
  customColor?: string
  children: React.ReactNode
  viewBox?: string
  dataTest?: string
  ariaHidden?: boolean
  reverseOnRtl?: boolean
  ariaLabel?: string
}

const StyledIcon = styled(
  ({
    className,
    viewBox,
    dataTest,
    children,
    ariaHidden,
    ariaLabel,
  }: IconProps) => (
    <svg
      className={className}
      viewBox={viewBox}
      data-test={dataTest}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden={ariaHidden ? "true" : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </svg>
  )
)`
  width: ${({ size }) => getSize(size)}px;
  height: ${({ size }) => getSize(size)}px;
  flex-shrink: 0;
  vertical-align: middle;
  fill: currentColor;
  color: ${({ color, customColor }) => customColor || (color && getColor())};
  ${reverse};
`

export const Icon = (props: IconProps) => {
  const {
    size = ICON_SIZES.MEDIUM,
    color,
    customColor,
    className,
    children,
    viewBox,
    dataTest,
    ariaHidden,
    reverseOnRtl,
    ariaLabel,
  } = props
  return (
    <StyledIcon
      viewBox={viewBox}
      size={size}
      className={className}
      dataTest={dataTest}
      customColor={customColor}
      color={color}
      ariaHidden={ariaHidden}
      reverseOnRtl={reverseOnRtl}
      ariaLabel={ariaLabel}
    >
      {children}
    </StyledIcon>
  )
}

export default Icon
