// src/services/posts.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PostService {
  async createPost(data) {
    const {
      title,
      description,
      scheduledFor,
      thumbnailUrl,
      sourceUrl,
      userId,
      platform = "YOUTUBE",
      visibility = "PUBLIC",
      categoryId,
      tags = [],
    } = data;

    return await prisma.post.create({
      data: {
        title,
        description,
        scheduledFor,
        thumbnailUrl,
        sourceUrl,
        userId,
        platform,
        visibility,
        categoryId,
        tags,
        status: scheduledFor ? "SCHEDULED" : "DRAFT",
      },
    });
  }

  async updatePost(id, data) {
    return await prisma.post.update({
      where: { id },
      data,
    });
  }

  async markAsPublished(id, platformPostId) {
    return await prisma.post.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        platformPostId,
        publishedAt: new Date(),
      },
    });
  }

  async markAsFailed(id, errorMessage) {
    return await prisma.post.update({
      where: { id },
      data: {
        status: "FAILED",
        errorMessage,
        retryCount: {
          increment: 1,
        },
      },
    });
  }

  async getPostById(id) {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async getPostByPlatformId(platformPostId) {
    return await prisma.post.findUnique({
      where: { platformPostId },
      include: {
        user: true,
      },
    });
  }

  async getUserPosts(userId, status = null) {
    const where = { userId };
    if (status) {
      where.status = status;
    }

    return await prisma.post.findMany({
      where,
      orderBy: [
        { scheduledFor: "desc" },
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        user: true,
      },
    });
  }

  async getScheduledPosts(from = new Date(), to = null) {
    const where = {
      status: "SCHEDULED",
      scheduledFor: {
        gte: from,
      },
    };

    if (to) {
      where.scheduledFor.lte = to;
    }

    return await prisma.post.findMany({
      where,
      orderBy: {
        scheduledFor: "asc",
      },
      include: {
        user: true,
      },
    });
  }

  async deletePost(id) {
    return await prisma.post.delete({
      where: { id },
    });
  }

  async updatePostStats(id, stats) {
    return await prisma.post.update({
      where: { id },
      data: {
        views: stats.views || 0,
        likes: stats.likes || 0,
      },
    });
  }
}
