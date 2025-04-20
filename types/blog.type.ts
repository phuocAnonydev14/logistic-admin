import {BaseEntity, ImageType} from "@/types/app.type";

export type BlogTag = "internal" | "external"

export interface BlogType extends BaseEntity {
  title: string;
  desc: string;
  content: string;
  slug: string;
  thumbnail: ImageType;
  tag: BlogTag
}


