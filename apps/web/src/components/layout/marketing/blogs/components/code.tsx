import { Pre, CodeBlock } from "fumadocs-ui/components/codeblock";

export const Code = ({ ...props }) => {
  return (
    <CodeBlock {...props} keepBackground>
      <Pre className="jetbrains-mono">{props.children}</Pre>
    </CodeBlock>
  );
};
