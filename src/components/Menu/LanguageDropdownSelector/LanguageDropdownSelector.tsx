import React from 'react';
import Select from 'react-select';
import { optionStyles } from '../ReactSelectStyles/option-styles';
import { controlStyles } from '../ReactSelectStyles/control-styles';
import { dropdownIndicatorStyles } from '../ReactSelectStyles/dropdown-indicator-styles';
import { groupHeadingStyles } from '../ReactSelectStyles/group-heading-styles';
import { noIndicatorSeparator } from '../ReactSelectCustomComponents/no-indicator-separator';
import { FormatOptionLabelWithLanguageLogo } from '../ReactSelectCustomComponents/Formatters/FormatOptionLabelWithLanguageLogo';
import { menuListStyles } from '../ReactSelectStyles/menu-list-styles';
import languageLabels from '../../../maps/language';
import { ReactSelectOption } from '../react-select-option-types';
import { PREFERRED_LANGUAGE_KEY } from '../../../utilities/language/constants';
import { createLanguageHrefFromDefaults, getLanguageDefaults } from '../../common/language-defaults';
import { safeWindow } from '../../../utilities/browser/safe-window';
import { navigate } from 'gatsby';
import { DEFAULT_LANGUAGE } from '../../../../data/createPages/constants';

export const LanguageDropdownSelector = ({
  language,
  languages,
  showDefaultLink,
}: {
  language: string;
  languages: string[];
  showDefaultLink: boolean;
}) => {
  const isSelectedLanguage = (option: ReactSelectOption) => option.value === language;
  const isNotSelectedLanguage = (option: ReactSelectOption) => option.value !== language;
  let options = languages.map((lang) => ({ label: languageLabels[lang] ?? lang, value: lang }));
  if (!showDefaultLink) {
    options = options.filter(({ value }) => value !== DEFAULT_LANGUAGE);
  }
  const selectedOption = options.find(isSelectedLanguage);
  return (
    <Select
      components={noIndicatorSeparator}
      classNamePrefix="react-select"
      menuPosition="fixed"
      isSearchable={false}
      styles={{
        control: controlStyles({ width: '192px' }),
        option: optionStyles({ width: '192px' }),
        dropdownIndicator: dropdownIndicatorStyles,
        groupHeading: groupHeadingStyles,
        menuList: menuListStyles,
      }}
      inputId={'language-menu'}
      value={selectedOption}
      options={[
        {
          label: 'Code Language:',
          options: options.filter(isNotSelectedLanguage),
        },
      ]}
      onChange={(newValue) => {
        const newLanguage = newValue?.value ?? DEFAULT_LANGUAGE;
        const { isLanguageDefault, isPageLanguageDefault } = getLanguageDefaults(newLanguage, language);
        const href = createLanguageHrefFromDefaults(isPageLanguageDefault, isLanguageDefault, newLanguage);
        if (isPageLanguageDefault) {
          safeWindow.localStorage.clear();
        } else {
          safeWindow.localStorage.setItem(PREFERRED_LANGUAGE_KEY, language);
        }
        navigate(href);
      }}
      formatOptionLabel={FormatOptionLabelWithLanguageLogo}
    />
  );
};