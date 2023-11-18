import type { Transformer } from "unified";
import type { Code, Literal, Root } from "mdast";
import type { Node, Parent } from "unist";

import fs from 'fs-extra';
import path from 'path';

export interface Skill {
  shortid?: string;
  name: string;
  code?: string;
  main?: string;
  description?: string;
  tags?: string[];
  dependencies?: string[];
  params?: Record<string, string>
  
}

function createImportNode() {
  return {
    type: "mdxjsEsm",
    value: "import DevsDownload from '@site/src/components/DevsDownload'",
    data: {
      estree: {
        type: "Program",
        body: [
          {
            type: "ImportDeclaration",
            specifiers: [
              {
                type: "ImportDefaultSpecifier",
                local: { type: "Identifier", name: "DevsDownload" },
              },
            ],
            source: {
              type: "Literal",
              value: "@site/src/components/DevsDownload",
              raw: "'@site/src/components/DevsDownload'",
            },
          },
        ],
        sourceType: "module",
      },
    },
  };
}

export default function plugin(): Transformer {
  const visited = new Set<Code>(); // visit called twice on async

  return async (root, vfile) => {
    const { visit } = await import("unist-util-visit");

    visit(root, "code", (node: Code, nodeIndex: number, parent: Parent) => {
      if (!parent || visited.has(node)) return;
      visited.add(node);

      if (node.lang === "devs") {
        const { lang, meta, value } = node;

        let skill = {code: value} as Skill;

        const directory = path.dirname(vfile.history[0]);
        const jsonFilePath = path.join(directory, "skill.json");
        if (fs.pathExistsSync(jsonFilePath)) {
          let mainFile = 'main.ts'
          skill = fs.readJSONSync(jsonFilePath) as Skill;
          if (skill.code)
            skill.code = skill.code;
          if (skill.main){
            mainFile = skill.main;
          }
          const mainFilePath = path.join(directory, mainFile);
          if (fs.pathExistsSync(mainFilePath)) {
            skill.code = fs.readFileSync(mainFilePath, 'utf-8');
          }
        }

        console.log("#1", skill);

        const startIndex = nodeIndex++;
        const mdx = [
          {
            type: "mdxJsxFlowElement",
            name: "DevsDownload",
            attributes: [
              {
                type: "mdxJsxAttribute",
                name: "name",
                value: "test",
              },
              {
                type: "mdxJsxAttribute",
                name: "config",
                value: JSON.stringify(skill),
              },
            ],
          },
        ];

        node.lang = "ts";

        // insert mdx to current node
        parent.children.splice(startIndex, 1, ...mdx);
      }
    });

    (root as Parent).children.unshift(createImportNode());
  };
}
