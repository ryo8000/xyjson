import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import yaml from 'js-yaml';
import { SupportedFormat } from './types';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

export const convert = (content: string, to: SupportedFormat): string => {
  let intermediate: unknown;
  if (content.startsWith('{') || content.startsWith('[')) {
    intermediate = JSON.parse(content);
  } else if (content.startsWith('<')) {
    intermediate = parser.parse(content);
  } else {
    intermediate = yaml.load(content);
  }

  let result: string;
  if (to === 'json') {
    result = JSON.stringify(intermediate);
  } else if (to === 'xml') {
    result = builder.build(intermediate);
  } else {
    result = yaml.dump(intermediate);
  }
  return result;
};
