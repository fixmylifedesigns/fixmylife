// src/services/publishedPosts.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PublishedPostsService {
  async createPublishedPost(data) {
    const {
      platformPostId, // YouTube video ID
      title,
      description,
      thumbnailUrl,
      userId,
      platform = "YOUTUBE",
    } = data;

    return await prisma.publishedPost.create({
      data: {
        platformPostId,
        title,
        description,
        thumbnailUrl,
        userId,
        platform,
        views: 0,
        likes: 0,
      },
    });
  }

  async getPostByPlatformId(platformPostId) {
    return await prisma.publishedPost.findUnique({
      where: {
        platformPostId,
      },
      include: {
        user: true,
      },
    });
  }

  async updatePostStats(platformPostId, stats) {
    return await prisma.publishedPost.update({
      where: {
        platformPostId,
      },
      data: {
        views: stats.views || 0,
        likes: stats.likes || 0,
      },
    });
  }

  async deletePost(platformPostId) {
    return await prisma.publishedPost.delete({
      where: {
        platformPostId,
      },
    });
  }

  async getUserPosts(userId) {
    return await prisma.publishedPost.findMany({
      where: {
        userId,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });
  }
}
