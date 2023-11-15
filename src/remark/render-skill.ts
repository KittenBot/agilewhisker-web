import type {Transformer} from 'unified';
import type {Code, Literal, Root} from 'mdast';
import type {Node, Parent} from 'unist';



function createImportNode() {
    return {
      type: 'mdxjsEsm',
      value:
        "import DevsDownload from '@site/src/components/DevsDownload'",
      data: {
        estree: {
          type: 'Program',
          body: [
            {
              type: 'ImportDeclaration',
              specifiers: [
                {
                  type: 'ImportDefaultSpecifier',
                  local: {type: 'Identifier', name: 'DevsDownload'},
                },
              ],
              source: {
                type: 'Literal',
                value: '@site/src/components/DevsDownload',
                raw: "'@site/src/components/DevsDownload'",
              },
            },
          ],
          sourceType: 'module',
        },
      },
    };
  }
  
export default function plugin(): Transformer {
    const visited = new Set<Code>(); // visit called twice on async

    return async (root, vfile) => {
        const {visit} = await import('unist-util-visit');

        visit(root, 'code', (node: Code, nodeIndex: number, parent: Parent) => {
            if (!parent || visited.has(node)) return;
            visited.add(node);

            if (node.lang === 'devs') {
                const { lang, meta, value } = node;
                
                console.log("#1", root, value, vfile);

                const startIndex = nodeIndex++;
                const mdx = [
                    {
                        type: 'mdxJsxFlowElement',
                        name: 'DevsDownload',
                        attributes: [
                            {
                                type: 'mdxJsxAttribute',
                                name: 'name',
                                value: 'test',
                            },
                            {
                                type: 'mdxJsxAttribute',
                                name: 'code',
                                value: value,
                            }
                        ],
                    },
                ];
                

                node.lang = 'ts'

                // insert mdx to current node
                parent.children.splice(startIndex, 1, ...mdx);

            }
        });

        
        (root as Parent).children.unshift(createImportNode());

    }
}