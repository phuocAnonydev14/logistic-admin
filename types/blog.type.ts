import {BaseEntity, ImageType} from "@/types/app.type";

export interface BlogType extends BaseEntity {
  title: string;
  desc: string;
  content: string;
  slug: string;
  thumbnail: ImageType;
}


