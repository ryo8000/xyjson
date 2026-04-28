import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import yaml from 'js-yaml';

export type SupportedFormat = 'json' | 'xml' | 'yaml';

type ConvertOptions = {
  minify: boolean;
  indentSize: number;
  attributeNamePrefix: string;
};

export const convert = (content: string, to: SupportedFormat, options: ConvertOptions): string => {
  let intermediate: unknown;
  if (content.startsWith('{') || content.startsWith('[')) {
    try {
      intermediate = JSON.parse(content);
    } catch {
      // YAML flow style also starts with '{' or '[', e.g. {key: value}
      intermediate = yaml.load(content);
    }
  } else if (content.startsWith('<')) {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: options.attributeNamePrefix,
    });
    intermediate = parser.parse(content);
  } else {
    intermediate = yaml.load(content);
  }

  if (to === 'json') {
    return options.minify
      ? JSON.stringify(intermediate)
      : JSON.stringify(intermediate, null, options.indentSize) + '\n';
  }

  if (to === 'xml') {
    const builder = new XMLBuilder({
      indentBy: ' '.repeat(options.indentSize),
      ignoreAttributes: false,
      attributeNamePrefix: options.attributeNamePrefix,
      format: !options.minify,
    });
    return builder.build(intermediate);
  }

  return yaml.dump(intermediate, {
    indent: options.indentSize,
    lineWidth: -1,
    noRefs: true,
    flowLevel: options.minify ? 0 : -1,
  });
};
