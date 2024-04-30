import type { Code, Root } from "mdast";
import type { Transformer } from "unified";
import { visit } from "unist-util-visit";
import { createElement } from "./utils";

interface PackageManager {
  name: string;
  language: string;
  command: (cmds: string[]) => string;
}

export type RemarkInstallOptions = Partial<{
  Tabs: string;
  Tab: string;
  packageManagers: PackageManager[];
}>;

const defaultPackageManagers: PackageManager[] = [
  {
    name: "build.gradle.kts",
    language: "kotlin",
    command: (cmds) =>
      [
        "dependencies {",
        cmds.map((cmd) => `    implementation("${cmd}")`).join("\n"),
        "}",
      ].join("\n"),
  },
  {
    name: "build.gradle",
    language: "groovy",
    command: (cmds) =>
      [
        "dependencies {",
        cmds.map((cmd) => `    implementation '${cmd}'`).join("\n"),
        "}",
      ].join("\n"),
  },
  {
    name: "pom.xml",
    language: "xml",
    command: (cmds) => {
      return [
        "<dependencies>",
        cmds
          .map((cmd) => {
            const [group, artifact, version] = cmd.split(":");

            return [
              "  <dependency>",
              `    <groupId>${group}</groupId>`,
              `    <artifactId>${artifact}</artifactId>`,
              `    <version>${version}</version>`,
              "  </dependency>",
            ].join("\n");
          })
          .join("\n"),
        "</dependencies>",
      ].join("\n");
    },
  },
];

/**
 * It generates the following structure from a code block with `package-maven` as language
 *
 * @example
 * ```tsx
 * <Tabs items={["build.gradle.kts“, "build.gradle", "pom.xml"]}>
 *  <Tab value="build.gradle.kts">...</Tab>
 *  ...
 * </Tabs>
 * ```
 */
export function remarkMaven({
  Tab = "Tab",
  Tabs = "Tabs",
  packageManagers = defaultPackageManagers,
}: RemarkInstallOptions = {}): Transformer<Root, Root> {
  return (tree) => {
    visit(tree, "code", (node) => {
      if (node.lang !== "package-maven") return "skip";

      const insert = createElement(
        Tabs,
        {
          items: {
            type: "ArrayExpression",
            elements: packageManagers.map(({ name }) => ({
              type: "Literal",
              value: name,
            })),
          },
        },
        packageManagers.map(({ command, name, language }) => ({
          type: "mdxJsxFlowElement",
          name: Tab,
          attributes: [{ type: "mdxJsxAttribute", name: "value", value: name }],
          children: [
            {
              type: "code",
              lang: language,
              meta: node.meta,
              value: command(node.value.split("\n")),
            } satisfies Code,
          ],
        }))
      );

      Object.assign(node, insert);
    });
  };
}
