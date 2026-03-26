
"use client";

import React from "react";
import styled from "styled-components";

interface BurgerCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const BurgerCheckbox: React.FC<BurgerCheckboxProps> = ({
  checked,
  onChange,
}) => {
  return (
    <StyledWrapper>
      <label htmlFor="burger" className="burger">
        <input
          id="burger"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span />
        <span />
        <span />
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .burger {
    position: relative;
    width: 24px;
    height: 18px;
    background: transparent;
    cursor: pointer;
    display: block;
  }
  .burger input {
    display: none;
  }
  .burger span {
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: black;
    border-radius: 9px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;
  }
  .burger span:nth-of-type(1) {
    top: 0px;
    transform-origin: left center;
  }
  .burger span:nth-of-type(2) {
    top: 50%;
    transform: translateY(-50%);
    transform-origin: left center;
  }
  .burger span:nth-of-type(3) {
    top: 100%;
    transform-origin: left center;
    transform: translateY(-100%);
  }
  .burger input:checked ~ span:nth-of-type(1) {
    top: 0;
    left: 3px;
    transform: rotate(405deg);
  }
  .burger input:checked ~ span:nth-of-type(2) {
    width: 0%;
    opacity: 0;
  }
  .burger input:checked ~ span:nth-of-type(3) {
    top: 17px;
    left: 3px;
    transform: rotate(-405deg);
  }
`;

export default BurgerCheckbox;
