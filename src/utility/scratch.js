const x = (move) => {
  var a = !1;
  "local" === _data.game_mode
    ? (h = 1 === h ? 2 : 1)
    : 1 === h
    ? (h = 2)
    : ((h = 1),
      (a = r.check_no_moves(h))
        ? A("checkmate")
        : ((a = F.move_piece()), n(move)),
      (a = !0));
  a ||
    ((a = r.check_no_moves(h))
      ? A("checkmate")
      : ((a = r.check(h)), 0 < a.length && c(a)));
};
