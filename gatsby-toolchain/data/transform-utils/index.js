const textile = require("textile-js");
const { upperFirst, camelCase, identity } = require('lodash');
const { tryRetrieveMetaData, filterAllowedMetaFields, NO_MATCH } = require("./front-matter");
const DataTypes = require("../types");
const { ROOT_LEVEL, MAX_LEVEL } = require("../../src/components/Sidebar/consts");

// TODO: split this into more focused files.
const parseNanocPartials = contentString => contentString.split(/<%=\s+partial\s+partial_version\('([^')]*)'\)[^%>]*%>/);
const removeFalsy = dataArray => dataArray.filter(identity);
const makeHtmlTypeFromParentType = node => upperFirst(camelCase(`${node.internal.type}Html`));

const createNodesFromPath = (type, { createNode, createNodeId, createContentDigest }) => path => {
  const pieces = path.split('/');
  const values = {
    link: '',
    label: '',
    level: ROOT_LEVEL
  };
  const breadcrumbs = pieces.map((piece, i) => {
    values.level = values.level + i > MAX_LEVEL ? MAX_LEVEL : values.level + i;
    values.link = `${values.link}/${piece}`;
    values.label = upperFirst(piece);
    values.id = createNodeId(`${values.link} >>> Path`)

    return { ...values };
  });
  breadcrumbs.forEach((breadcrumb, i) => {
    const newNodeData = {
      ...breadcrumb,
      children: [],
    };
    if(breadcrumbs[i-1]) {
      newNodeData.parent = breadcrumbs[i-1].id;
    }
    const newNodeInternals = {
      contentDigest: createContentDigest(breadcrumb.link),
      type,
      mediaType: 'text/plain'
    };
    const pathNode = {
      ...newNodeData,
      internal: newNodeInternals,
    }
    createNode(pathNode);
  });
}

const constructDataObjectsFromStrings = contentStrings => contentStrings.map(
  (data, i) => i % 2 === 0 ?
    { data: textile(data), type: DataTypes.Html } :
    { data, type: DataTypes.Partial }
  );

const flattenContentOrderedList = contentOrderedList => contentOrderedList.reduce((acc, {data, type}) => {
  if(Array.isArray(data)) {
      return acc.concat(flattenContentOrderedList(data));
  }
  return acc.concat([{ data, type }]);
}, []);

// Source: https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/creating-a-transformer-plugin/
const transformNanocTextiles = (node, content, createContentDigest, id, type, createNodesFromPath) => updateWithTransform => {
    // if we need it, use DOMParser not Cheerio!
    const withPartials = parseNanocPartials(content);
    const withoutFalsyValues = removeFalsy(withPartials);

    const frontmatterMeta = tryRetrieveMetaData(withoutFalsyValues[0]);
    if(frontmatterMeta !== NO_MATCH) {
      withoutFalsyValues[0] = frontmatterMeta.body;
    }

    const asDataObjects = constructDataObjectsFromStrings(withoutFalsyValues);
    const newNodeData = {
      contentOrderedList: asDataObjects,
      id,
      children: [],
      parent: node.id,
    };

    if(frontmatterMeta !== NO_MATCH) {
      newNodeData.meta = filterAllowedMetaFields(frontmatterMeta.attributes);
    }

    const newNodeInternals = {
      contentDigest: createContentDigest(asDataObjects),
      type,
      mediaType: 'text/html'
    };
    if(node.sourceInstanceName === 'textile-partials') {
      newNodeInternals.type = `${type}Partial`;
      newNodeData.relativePath = node.relativePath;
    } else {
      createNodesFromPath(node.relativePath.replace(/\.[^/.]+$/, ""));
      // Partials should never have a slug, every other page type needs one.
      newNodeData.slug = node.name;
    }
    const htmlNode = {
      ...newNodeData,
      internal: newNodeInternals,
    }
    if (content.id) {
        htmlNode[`htmlId`] = content.id
    }
    updateWithTransform({ parent: node, child: htmlNode })
}

const maybeRetrievePartial = graphql => async ({ data, type }) => {
  if(type !== DataTypes.Partial) {
    return { data, type };
  }
  const result = await graphql(`
      query {
        fileHtmlPartial(relativePath: { eq:"${data}.textile"}) {
          contentOrderedList {
            data
            type
          }
        }
      }
    `)
  const partial = result.data.fileHtmlPartial;
  const retrievePartialFromGraphQL = maybeRetrievePartial(graphql);
  let contentOrderedList = partial && partial.contentOrderedList;
  if(partial) {
    contentOrderedList = await Promise.all(contentOrderedList.map(retrievePartialFromGraphQL));
  }

  return {
    data: contentOrderedList,
    type
  };
}

module.exports = {
  createNodesFromPath,
  transformNanocTextiles,
  makeHtmlTypeFromParentType,
  maybeRetrievePartial,
  flattenContentOrderedList
};