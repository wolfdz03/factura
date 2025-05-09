import { Pre, CodeBlock } from "fumadocs-ui/components/codeblock";

export const Code = ({ ...props }) => {
  return (
    <CodeBlock {...props} keepBackground>
      <Pre>{props.children}</Pre>
    </CodeBlock>
  );
};
