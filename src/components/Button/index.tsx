import type { IButton } from "@/shared/types/button.interface"
import type { FC, ButtonHTMLAttributes } from 'react';

export interface IButtonProps extends IButton, ButtonHTMLAttributes<HTMLButtonElement> {
  text: string; 
}

export const Button: FC<IButtonProps> = ({ text, children, ...rest }) => {
  return (
    <button {...rest}>
      {text || children}
    </button>
  );
};