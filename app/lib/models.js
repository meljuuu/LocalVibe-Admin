import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your Name"],
    },
    userName: {
      type: String,
    },
    bio: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

    accountType: {
      type: String,
      enum: ["admin", "personal", "business", "prembusiness"],
      default: "personal",
      required: [true, "Please specify the account type"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    avatar: {
      public_id: {
        type: String,
        required: [true, "Please upload one profile picture!"],
      },
      url: {
        type: String,
        required: [true, "Please upload one profile picture!"],
      },
    },
    coverPhoto: {
      public_id: {
        type: String,
        default: null,
      },
      url: {
        type: String,
        default: null,
      },
    },
    followers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    following: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    interactions: [
      {
        post_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
          required: true,
        },
        score: {
          type: Number,
          default: 0,
        },
      },
    ],
    share: [
      {
        post_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
          required: true,
        },
      },
    ],
    similarUsers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        similarityScore: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedItemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    itemType: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    reportTitle: {
      type: String,
      required: true,
    },
    reportImage: {
      type: String,
      required: true,
    },
    reportCount: {
      type: Number,
      required: true,
      min: 1,
    },
    reportDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    user: {
      type: Object,
    },
    likes: [
      {
        name: {
          type: String,
        },
        userName: {
          type: String,
        },
        userId: {
          type: String,
        },
        userAvatar: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    replies: [
      {
        user: {
          type: Object,
        },
        title: {
          type: String,
        },
        image: {
          public_id: {
            type: String,
          },
          url: {
            type: String,
          },
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        likes: [
          {
            name: {
              type: String,
            },
            userName: {
              type: String,
            },
            userId: {
              type: String,
            },
            userAvatar: {
              type: String,
            },
          },
        ],
        reply: [
          {
            user: {
              type: Object,
            },
            title: {
              type: String,
            },
            image: {
              public_id: {
                type: String,
              },
              url: {
                type: String,
              },
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
            likes: [
              {
                name: {
                  type: String,
                },
                userName: {
                  type: String,
                },
                userId: {
                  type: String,
                },
                userAvatar: {
                  type: String,
                },
              },
            ],
          },
        ],
      },
    ],
    userInteractions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        score: {
          type: Number,
          default: 0,
        },
      },
    ],
    shares: [
      {
        name: {
          type: String,
        },
        userName: {
          type: String,
        },
        userId: {
          type: String,
        },
        userAvatar: {
          type: String,
        },
        postId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
      },
    ],
  },
  { timestamps: true }
);

const pinSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    contactInfo: {
      phone: String,
      email: String,
      website: String,
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    visitors: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        created_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reviews: [
      {
        pinId: {
          type: String,
          required: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        reviewText: {
          type: String,
          required: true,
        },
        ratings: {
          type: Number,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reviewCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: "",
    },
    proofOfBusinessImage: {
      type: String,
      default: "",
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Initialize models
let User, Report, Admin, Post, Pin;

try {
  User = mongoose.models.User || mongoose.model("User", userSchema);
  Report = mongoose.models.Report || mongoose.model("Report", reportSchema);
  Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
  Post = mongoose.models.Post || mongoose.model("Post", postSchema);
  Pin = mongoose.models.Pin || mongoose.model("Pin", pinSchema);
} catch (error) {
  console.error("Error initializing models:", error);
}

export { User, Report, Admin, Post, Pin };
