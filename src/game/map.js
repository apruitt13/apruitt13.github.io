// Simple Minimap manager — global MapManager
(function (global) {
  const MapManager = {
    canvas: null,
    ctx: null,
    explored: new Set(),
    maxRadius: 3,      // maximum rooms distance from origin allowed
    cellSize: 12,      // pixels per room square in minimap
    padding: 6,
    init(id, opts = {}) {
      this.canvas = document.getElementById(id);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      if (opts.maxRadius !== undefined) this.maxRadius = opts.maxRadius;
      if (opts.cellSize !== undefined) this.cellSize = opts.cellSize;
      this.clear();
    },
    key(rx, ry) { return `${rx},${ry}`; },
    allowed(rx, ry) {
      return Math.abs(rx) <= this.maxRadius && Math.abs(ry) <= this.maxRadius;
    },
    reveal(rx, ry, roomData) {
      // only reveal allowed rooms
      if (!this.allowed(rx, ry)) return false;
      this.explored.add(this.key(rx, ry));
      return true;
    },
    hideAll() {
      this.explored.clear();
      this.clear();
    },
    clear() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    draw(centerRx, centerRy, roomsObj) {
      if (!this.ctx || !this.canvas) return;
      const ctx = this.ctx;
      const w = this.canvas.width, h = this.canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);

      const gridSize = this.maxRadius * 2 + 1;
      const totalSize = gridSize * this.cellSize;
      const offsetX = Math.floor((w - totalSize) / 2) + this.padding;
      const offsetY = Math.floor((h - totalSize) / 2) + this.padding;

      // draw explored rooms
      for (let ry = -this.maxRadius; ry <= this.maxRadius; ry++) {
        for (let rx = -this.maxRadius; rx <= this.maxRadius; rx++) {
          const k = this.key(rx, ry);
          const sx = offsetX + (rx + this.maxRadius) * this.cellSize;
          const sy = offsetY + (ry + this.maxRadius) * this.cellSize;
          // unexplored = black
          if (!this.explored.has(k)) {
            ctx.fillStyle = '#000';
            ctx.fillRect(sx, sy, this.cellSize - 1, this.cellSize - 1);
            continue;
          }
          // explored: try to color by content if available
          const room = roomsObj && roomsObj[k] ? roomsObj[k] : null;
          if (room && room.boss) ctx.fillStyle = '#8b0000'; // boss
          else ctx.fillStyle = '#2b556e'; // explored floor
          ctx.fillRect(sx, sy, this.cellSize - 1, this.cellSize - 1);

          // collectibles marker
          if (room && room.collectibles && room.collectibles.length > 0) {
            ctx.fillStyle = '#facc15';
            ctx.fillRect(sx + Math.floor(this.cellSize / 4), sy + Math.floor(this.cellSize / 4), Math.max(2, Math.floor(this.cellSize / 2)), Math.max(2, Math.floor(this.cellSize / 2)));
          }
        }
      }

      // highlight current room with outline
      const curX = centerRx + this.maxRadius;
      const curY = centerRy + this.maxRadius;
      const cx = offsetX + curX * this.cellSize;
      const cy = offsetY + curY * this.cellSize;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx + 0.5, cy + 0.5, this.cellSize - 2, this.cellSize - 2);
    }
  };

  global.MapManager = MapManager;
})(window);