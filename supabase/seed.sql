insert into public.curations (slug, name_cn, name_en, bucket, display_order) values
  ('niulang-zhinu', '牛郎织女', 'Cowherd and Weaver Girl', '爱情', 1),
  ('hongloumeng', '红楼梦', 'Dream of the Red Chamber', '人物', 2),
  ('xiyouji', '西游记', 'Journey to the West', '神话', 3),
  ('baishezhuan', '白蛇传', 'Legend of the White Snake', '民间', 4),
  ('mulan', '花木兰', 'Mulan', '人物', 5),
  ('change', '嫦娥奔月', 'Chang E', '神话', 6)
on conflict (slug) do nothing;

insert into public.fengyun_challenges
  (year_month, challenge_type, name_cn, criterion_cn, max_points, max_winners, pool_share)
values
  ('2026-06', 'action', '班底成形', '首个完成全队出席小组会议', 20, 1, 20),
  ('2026-06', 'intellectual', '我的主题为什么值得一年', '100字短文 · 6/25前提交 · 文化营朗读', 10, 1, 10),
  ('2026-06', 'result', '迎新会主题展现', '最佳策展介绍 · 策划组评选', 10, 1, 10),
  ('2026-07', 'intellectual', '第一手的资料挖掘', '提交可验证的第一手资料', 15, 2, 15),
  ('2026-07', 'action', '长辈邀请', '邀请1位60+长辈到工作坊分享', 20, 1, 20),
  ('2026-07', 'result', '最佳故事大纲', '7月31日前最佳故事大纲', 25, 1, 25)
on conflict do nothing;

insert into public.monthly_owners (year_month, theme_cn) values
  ('2026-06', '首发月'),
  ('2026-07', '寻根月'),
  ('2026-08', '搭桥月'),
  ('2026-09', '视觉月'),
  ('2026-10', '讲解月'),
  ('2026-11', '试演月'),
  ('2026-12', '冲刺月'),
  ('2027-01', '志工大会')
on conflict (year_month) do nothing;
