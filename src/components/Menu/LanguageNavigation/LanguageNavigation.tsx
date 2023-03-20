import React, { FunctionComponent as FC, useCallback, useContext, useState } from 'react';
import { SingleValue } from 'react-select';

import { createLanguageHrefFromDefaults, getLanguageDefaults, ReactSelectOption, Select } from 'src/components';
import { PageLanguageContext } from 'src/contexts';

import {
  DEFAULT_LANGUAGE,
  DEFAULT_PREFERRED_LANGUAGE,
  DEFAULT_PREFERRED_INTERFACE,
  SDK_INTERFACES,
} from '../../../../data/createPages/constants';
import { cacheVisitPreferredLanguage } from 'src/utilities';

import { dropdownContainer, horizontalNav } from './LanguageNavigation.module.css';
import LanguageButton from '../../LanguageButton/LanguageButton';
import Icon from '@ably/ui/core/Icon';
import { getSDKInterface } from '../../blocks/wrappers/ConditionalChildrenLanguageDisplay';

export interface LanguageNavigationComponentProps {
  language: string;
  sdkInterface?: string;
  onClick?: (event: { target: { value: string } }) => void;
  value?: string;
  isSelected?: boolean;
  isSDK?: boolean;
  isEnabled?: boolean;
  isSDKSelected?: boolean;
}

export interface LanguageNavigationProps {
  items: {
    Component: FC<LanguageNavigationComponentProps>;
    props: LanguageNavigationComponentProps;
    content: string;
  }[];
  localChangeOnly?: boolean;
  selectedLanguage?: string;
  onSelect?: (newValue: SingleValue<ReactSelectOption>) => void;
  SDKSelected?: string;
}

const changePageOnSelect =
  (pageLanguage: string, sdkInterface: string) => (newValue: SingleValue<ReactSelectOption>) => {
    if (newValue) {
      const language = newValue.value;
      const { isLanguageDefault, isPageLanguageDefault } = getLanguageDefaults(language, pageLanguage);
      const href = createLanguageHrefFromDefaults(isPageLanguageDefault, isLanguageDefault, language, sdkInterface);
      cacheVisitPreferredLanguage(isPageLanguageDefault, language, href, sdkInterface);
    }
  };

const SDKToolTip = ({ tooltip }: { tooltip: string }) => {
  const [tooltipHover, setTooltipHover] = useState(false);
  const showTooltipHover = useCallback(() => setTooltipHover(true), []);
  const hideTooltipHover = useCallback(() => setTooltipHover(false), []);
  return (
    <div
      className="flex flex-row w-full justify-start mt-2"
      onMouseOver={showTooltipHover}
      onMouseOut={hideTooltipHover}
    >
      <Icon name="icon-gui-info" size="1.25rem" color="mid-grey" additionalCSS="mt-12 ml-16" />
      {tooltipHover ? (
        <aside
          className="w-240 max-w-240 absolute box-border
          whitespace-pre-wrap bg-white shadow-tooltip rounded border border-light-grey
          text-cool-black font-sans p-16 text-center text-p3 leading-5 cursor-default -ml-160 -mt-88"
        >
          {tooltip}
        </aside>
      ) : null}
    </div>
  );
};

const SDKNavigation = ({ selectedLanguage, SDKSelected }: LanguageNavigationProps) => {
  let sdkSelectedTab = '';
  if (SDKSelected != null) {
    sdkSelectedTab = SDK_INTERFACES.includes(SDKSelected) ? SDKSelected : DEFAULT_PREFERRED_INTERFACE;
  }

  return (
    <div className="bg-dark-grey border-charcoal-grey text-white border-b-4 flex justify-end">
      <menu data-testid="menuSDK" className="flex md:overflow-x-auto pl-0 justify-end md:justify-start h-48 mr-16 my-0">
        {SDK_INTERFACES.map((sdkInterface) => (
          <LanguageButton
            key={sdkInterface}
            language={selectedLanguage || DEFAULT_PREFERRED_LANGUAGE}
            sdkInterface={sdkInterface || DEFAULT_PREFERRED_INTERFACE}
            isSDK={true}
            isSDKSelected={sdkSelectedTab === sdkInterface}
            // isEnabled={sdkTabsActive?.includes(sdkInterface)}
          />
        ))}
        <SDKToolTip tooltip="Tooltips display informative text when users hover over, focus on, or tap an element." />
      </menu>
    </div>
  );
};

const LanguageNavigation = ({ items, localChangeOnly, selectedLanguage, onSelect }: LanguageNavigationProps) => {
  const pageLanguage = useContext(PageLanguageContext);
  const selectedPageLanguage = pageLanguage === DEFAULT_LANGUAGE ? DEFAULT_PREFERRED_LANGUAGE : pageLanguage;
  const actualSelectedLanguage = localChangeOnly ? selectedLanguage : selectedPageLanguage;
  const options = items.map((item) => ({ label: item.content, value: item.props.language }));
  const value = options.find((option) => option.value === actualSelectedLanguage);

  const shouldUseLocalChanges = localChangeOnly && !!onSelect;
  const onSelectChange = shouldUseLocalChanges
    ? onSelect
    : changePageOnSelect(pageLanguage, DEFAULT_PREFERRED_INTERFACE);
  const selectedSDK = getSDKInterface();
  const realtimeCode = getLanguageItemsIfHasSDKInterface(items, 'rt');
  const restCode = getLanguageItemsIfHasSDKInterface(items, 'rest');

  return (
    <>
      {realtimeCode.includes(true) || restCode.includes(true) ? (
        <SDKNavigation
          items={items}
          localChangeOnly={localChangeOnly}
          selectedLanguage={selectedLanguage}
          onSelect={onSelect}
          SDKSelected={selectedSDK}
        />
      ) : null}

      {items.length >= 2 ? (
        <div className="border-b border-charcoal-grey w-full">
          <menu data-testid="menu" className={horizontalNav}>
            {items.map(({ Component, props, content }, index) => (
              <Component {...props} key={index}>
                {content}
              </Component>
            ))}
            <div className={dropdownContainer}>
              <Select options={options} value={value} isSearchable={false} onChange={onSelectChange} />
            </div>
          </menu>
        </div>
      ) : null}
    </>
  );
};

export default LanguageNavigation;

const getLanguageItemsIfHasSDKInterface = (
  items: {
    Component: FC<LanguageNavigationComponentProps>;
    props: LanguageNavigationComponentProps;
    content: string;
  }[],
  sdkInterface: string,
) => items.map((languageItems) => languageItems.props.language.includes(sdkInterface));
