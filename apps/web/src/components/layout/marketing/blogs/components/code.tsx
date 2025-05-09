import { Pre, CodeBlock } from "fumadocs-ui/components/codeblock";

export const Code = ({ ...props }) => {
  return (
    <CodeBlock {...props}>
      <Pre>{props.children}</Pre>
    </CodeBlock>
  );
};
