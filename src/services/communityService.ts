import type { Post, ReactionType } from '../types/community';

// Mock data cho demo
const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'Nguyễn Văn A',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    title: 'Phở Bò Hà Nội Truyền Thống',
    description: 'Chia sẻ công thức nấu phở bò Hà Nội đúng chuẩn, thơm ngon như hàng quán.',
    images: [
      'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800',
    ],
    tags: ['phở', 'món việt', 'món chính'],
    ingredients: [
      '1kg xương bò',
      '500g thịt bò',
      'Hành, gừng',
      'Gia vị: hồi, quế, thảo quả',
      'Bánh phở tươi',
      'Rau thơm: hành, ngò, giá',
    ],
    instructions: [
      'Chần xương bò qua nước sôi',
      'Nấu nước dùng với xương và gia vị trong 4-6 giờ',
      'Thái thịt bò mỏng',
      'Trụng bánh phở, cho vào tô',
      'Chan nước dùng nóng, thêm rau thơm',
    ],
    createdAt: '2025-11-04T10:30:00Z',
    reactions: [
      { type: 'like', count: 45, userReacted: false },
      { type: 'love', count: 32, userReacted: true },
      { type: 'delicious', count: 28, userReacted: false },
      { type: 'wow', count: 15, userReacted: false },
    ],
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'Trần Thị B',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    title: 'Thực đơn ăn kiêng giảm cân trong 1 tuần',
    description: 'Thực đơn eat clean giúp giảm cân hiệu quả mà vẫn đầy đủ dinh dưỡng.',
    images: [
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    ],
    tags: ['giảm cân', 'eat clean', 'healthy', 'thực đơn'],
    createdAt: '2025-11-03T15:20:00Z',
    reactions: [
      { type: 'like', count: 89, userReacted: true },
      { type: 'love', count: 67, userReacted: false },
      { type: 'delicious', count: 23, userReacted: false },
      { type: 'wow', count: 34, userReacted: false },
    ],
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'Lê Văn C',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    title: 'Bánh Mì Việt Nam - Món ăn sáng tuyệt vời',
    description: 'Hướng dẫn làm bánh mì thịt nguội tại nhà, đơn giản mà ngon không kém ngoài hàng.',
    images: [
      'https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=800',
    ],
    tags: ['bánh mì', 'món việt', 'ăn sáng'],
    ingredients: [
      'Bánh mì que',
      'Pate gan',
      'Thịt nguội',
      'Dưa leo, rau mùi, đồ chua',
      'Tương ớt, tương đen',
    ],
    instructions: [
      'Nướng bánh mì cho giòn',
      'Xẻ bánh, phết pate',
      'Thêm thịt nguội, đồ chua, rau thơm',
      'Chan tương, thưởng thức',
    ],
    createdAt: '2025-11-02T08:15:00Z',
    reactions: [
      { type: 'like', count: 56, userReacted: false },
      { type: 'love', count: 41, userReacted: false },
      { type: 'delicious', count: 72, userReacted: true },
      { type: 'wow', count: 19, userReacted: false },
    ],
  },
  {
    id: '4',
    author: {
      id: 'user4',
      name: 'Phạm Thị D',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    title: 'Lẩu Thái Chua Cay - Hoàn hảo cho ngày mưa',
    description: 'Công thức nấu lẩu Thái tom yum chuẩn vị, chua cay đậm đà.',
    images: [
      'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800',
    ],
    tags: ['lẩu', 'món thái', 'chua cay'],
    ingredients: [
      'Tôm, mực, hải sản',
      'Nấm các loại',
      'Sả, gừng, ớt',
      'Nước cốt me, nước mắm',
      'Rau ăn kèm',
    ],
    createdAt: '2025-11-01T18:45:00Z',
    reactions: [
      { type: 'like', count: 63, userReacted: false },
      { type: 'love', count: 55, userReacted: false },
      { type: 'delicious', count: 48, userReacted: false },
      { type: 'wow', count: 29, userReacted: false },
    ],
  },
];

export const communityService = {
  // Lấy tất cả posts
  getPosts: async (): Promise<Post[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPosts);
      }, 500);
    });
  },

  // Lấy một post theo ID
  getPostById: async (id: string): Promise<Post | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const post = mockPosts.find((p) => p.id === id);
        resolve(post);
      }, 300);
    });
  },

  // Toggle reaction cho post
  toggleReaction: async (
    postId: string,
    reactionType: ReactionType
  ): Promise<Post | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const post = mockPosts.find((p) => p.id === postId);
        if (post) {
          const reaction = post.reactions.find((r) => r.type === reactionType);
          if (reaction) {
            if (reaction.userReacted) {
              reaction.count--;
              reaction.userReacted = false;
            } else {
              // Remove other reactions from user
              post.reactions.forEach((r) => {
                if (r.userReacted) {
                  r.count--;
                  r.userReacted = false;
                }
              });
              reaction.count++;
              reaction.userReacted = true;
            }
          }
        }
        resolve(post);
      }, 200);
    });
  },
};
