import React from 'react';
import { filterAttribsForReact } from '../../react-utilities';
import componentMap from '../component-map';
import Html from './Html';

const blocksFromData = (data) =>
  data.map(({ attribs, data, name }, i) => {
    const Block = componentMap(name) ?? Html;
    const filteredAttribs = filterAttribsForReact(attribs);
    return <Block key={i} attribs={filteredAttribs} data={data} />;
  });

export default blocksFromData;