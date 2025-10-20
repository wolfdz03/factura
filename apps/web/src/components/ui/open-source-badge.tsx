import { GithubIcon } from "@/assets/icons";
import { LINKS } from "@/constants/links";
import Link from "next/link";
import React from "react";

const OpenSourceBadge = () => {
  return (
    <Link href={LINKS.SOCIALS.GITHUB} target="_blank">
      <div className="bg-muted-foreground/10 hover:bg-primary/10 hover:text-primary mb-2 flex flex-row items-center gap-2 rounded-md px-2 py-1 duration-200">
        <GithubIcon height={16} width={16} />
        <div className="urbanist text-xs">Fièrement Open Source</div>
      </div>
    </Link>
  );
};

export default OpenSourceBadge;
