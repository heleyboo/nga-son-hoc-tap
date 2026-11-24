import { z } from "zod";

export const roomCode = z.string().regex(/^\d{6}$/, "Mã phòng gồm 6 chữ số");

export const createRoomInput = z.object({
  grade: z.union([z.literal(6), z.literal(7), z.literal(8), z.literal(9)]),
  level: z.enum(["basic", "advanced"]),
  subjects: z.array(z.string().max(40)).max(10).default([]),
  count: z.number().int().min(3).max(30).default(10),
  seconds: z.number().int().min(10).max(60).default(20),
});

export const joinInput = z.object({
  name: z.string().trim().min(1, "Hãy nhập tên").max(40),
  className: z.string().trim().max(20).optional().nullable(),
});

export const answerInput = z.object({
  playerId: z.string().min(1).max(40),
  token: z.string().min(1).max(80),
  qIndex: z.number().int().min(0),
  choice: z.number().int().min(0).max(9),
});

export const hostInput = z.object({
  key: z.string().min(1).max(80),
  action: z.enum(["start", "reveal", "leaderboard", "next", "end", "kick"]),
  playerId: z.string().max(40).optional(),
});
