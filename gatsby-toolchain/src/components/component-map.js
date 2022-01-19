import { curry, propOr } from 'lodash/fp';
import HtmlDataTypes from '../../data/types/html';
import { Button, Input, Meter, Noscript, Progress, Select, Textarea } from './blocks/complex-functionality';
import { Article, Aside, Div, Main, Section, Span } from './blocks/dividers';
import { A, Address, Audio, Blockquote, Iframe, Img, Quote, Video } from './blocks/external-references';
import { H1, H2, H3, H4, H5, H6, Header } from './blocks/headings';
import { Dd, Dt, Dl, Li, Ol, Ul } from './blocks/list';
import Br from './blocks/non-semantic/Br';
import Wbr from './blocks/non-semantic/Wbr';
import { Abbr, Details, Dfn, Summary, Time } from './blocks/semantic-enhancements';
import { Code, Kbd, Output, Pre, Samp, Var } from './blocks/software';
import { Em, Small, Strong, Sub, Sup } from './blocks/styles';
import { Caption, Col, Colgroup, Table, Tbody, Td, Tfoot, Th, Thead, Tr } from './blocks/table';
import Paragraph from './blocks/paragraphs';

const IS_TEXT = null;

const HtmlTypeComponentMap = Object.freeze({
    // text
    [HtmlDataTypes.p]: Paragraph,
    // semantic styles
    [HtmlDataTypes.strong]: Strong,
    [HtmlDataTypes.em]: Em,
    [HtmlDataTypes.small]: Small,
    [HtmlDataTypes.sub]: Sub,
    [HtmlDataTypes.sup]: Sup,
    // enhancements
    [HtmlDataTypes.abbr]: Abbr,
    [HtmlDataTypes.details]: Details,
    [HtmlDataTypes.summary]: Summary,
    [HtmlDataTypes.dfn]: Dfn,
    [HtmlDataTypes.time]: Time,
    // software-related
    [HtmlDataTypes.code]: Code,
    [HtmlDataTypes.kbd]: Kbd,
    [HtmlDataTypes.output]: Output,
    [HtmlDataTypes.pre]: Pre,
    [HtmlDataTypes.samp]: Samp,
    [HtmlDataTypes.var]: Var,
    // external references
    [HtmlDataTypes.a]: A,
    [HtmlDataTypes.iframe]: Iframe,
    [HtmlDataTypes.img]: Img,
    [HtmlDataTypes.video]: Video,
    [HtmlDataTypes.audio]: Audio,
    [HtmlDataTypes.address]: Address,
    [HtmlDataTypes.blockquote]: Blockquote,
    [HtmlDataTypes.q]: Quote,
    // headings
    [HtmlDataTypes.header]: Header,
    [HtmlDataTypes.h1]: H1,
    [HtmlDataTypes.h2]: H2,
    [HtmlDataTypes.h3]: H3,
    [HtmlDataTypes.h4]: H4,
    [HtmlDataTypes.h5]: H5,
    [HtmlDataTypes.h6]: H6,
    // tables
    [HtmlDataTypes.caption]: Caption,
    [HtmlDataTypes.colgroup]: Colgroup,
    [HtmlDataTypes.col]: Col,
    [HtmlDataTypes.table]: Table,
    [HtmlDataTypes.tbody]: Tbody,
    [HtmlDataTypes.td]: Td,
    [HtmlDataTypes.tfoot]: Tfoot,
    [HtmlDataTypes.th]: Th,
    [HtmlDataTypes.thead]: Thead,
    [HtmlDataTypes.tr]: Tr,
    // lists
    [HtmlDataTypes.dl]: Dl,
    [HtmlDataTypes.dd]: Dd,
    [HtmlDataTypes.dt]: Dt,
    [HtmlDataTypes.li]: Li,
    [HtmlDataTypes.ol]: Ol,
    [HtmlDataTypes.ul]: Ul,
    // dividers
    [HtmlDataTypes.main]: Main,
    [HtmlDataTypes.article]: Article,
    [HtmlDataTypes.section]: Section,
    [HtmlDataTypes.aside]: Aside,
    [HtmlDataTypes.span]: Span,
    [HtmlDataTypes.div]: Div,
    // complex functionality
    [HtmlDataTypes.input]: Input,
    [HtmlDataTypes.button]: Button,
    [HtmlDataTypes.meter]: Meter,
    [HtmlDataTypes.noscript]: Noscript,
    [HtmlDataTypes.progress]: Progress,
    [HtmlDataTypes.select]: Select,
    [HtmlDataTypes.textarea]: Textarea,
    // other/utility
    [HtmlDataTypes.br]: Br,
    [HtmlDataTypes.wbr]: Wbr
});

const componentMap = propOr(IS_TEXT, curry.placeholder, HtmlTypeComponentMap);

export {
    IS_TEXT
};
export default componentMap;