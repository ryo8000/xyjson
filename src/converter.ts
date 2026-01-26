import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import yaml from 'js-yaml';

export type SupportedFormat = 'json' | 'xml' | 'yaml';

type ConvertOptions = {
  minify: boolean;
};

const INDENT_SIZE = 2;

export const convert = (content: string, to: SupportedFormat, options: ConvertOptions): string => {
  let intermediate: unknown;
  if (content.startsWith('{') || content.startsWith('[')) {
    intermediate = JSON.parse(content);
  } else if (content.startsWith('<')) {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    intermediate = parser.parse(content);
  } else {
    intermediate = yaml.load(content);
  }

  if (to === 'json') {
    return options.minify
      ? JSON.stringify(intermediate)
      : JSON.stringify(intermediate, null, INDENT_SIZE) + '\n';
  }

  if (to === 'xml') {
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      format: !options.minify,
    });
    return builder.build(intermediate);
  }

  return yaml.dump(intermediate, {
    indent: INDENT_SIZE,
    lineWidth: -1,
    noRefs: true,
    flowLevel: options.minify ? 0 : -1,
  });
};
