import {
  Component, Input, ElementRef, ViewChild,
  AfterViewInit, OnDestroy, effect, signal
} from '@angular/core';

@Component({
  selector: 'app-mini-chart',
  standalone: true,
  template: `<canvas #canvas class="mini-chart"></canvas>`,
  styles: [`
    :host { display: block; width: 100%; }
    .mini-chart {
      display: block;
      width: 100%;
      height: 40px;
      border-radius: 4px;
    }
  `]
})
export class MiniChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  /** Pass data as a signal-friendly input */
  @Input() set data(val: number[]) { this._data.set(val); }
  @Input() width = 240;
  @Input() height = 40;

  private _data = signal<number[]>([]);
  private ready = false;
  private resizeObs: ResizeObserver | null = null;

  constructor() {
    // Redraw whenever data signal changes
    effect(() => {
      const d = this._data();
      if (this.ready) this.draw(d);
    });
  }

  ngAfterViewInit(): void {
    this.ready = true;
    // Observe container resize for responsive width
    const canvas = this.canvasRef.nativeElement;
    this.resizeObs = new ResizeObserver(() => this.draw(this._data()));
    this.resizeObs.observe(canvas.parentElement!);
    this.draw(this._data());
  }

  ngOnDestroy(): void {
    this.resizeObs?.disconnect();
  }

  private draw(pts: number[]): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const w = parent ? parent.clientWidth : this.width;
    const h = this.height;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    if (pts.length === 0) return;

    // If only 1 point, draw a flat line at center
    if (pts.length === 1) {
      const y = h / 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dot at right
      ctx.beginPath();
      ctx.arc(w - 4, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#c9a84c';
      ctx.fill();
      return;
    }

    const padY = 4;
    const usableH = h - padY * 2;
    const min = Math.min(...pts) - 1;
    const max = Math.max(...pts) + 1;
    const range = max - min || 1;
    const xStep = w / (pts.length - 1);

    const trend = pts[pts.length - 1] - pts[0];
    const lineColor = trend >= 0 ? '#22c55e' : '#ef4444';
    const areaColor = trend >= 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)';

    const getY = (v: number) => padY + usableH - ((v - min) / range) * usableH;

    // Filled area
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let i = 0; i < pts.length; i++) {
      ctx.lineTo(i * xStep, getY(pts[i]));
    }
    ctx.lineTo((pts.length - 1) * xStep, h);
    ctx.closePath();
    ctx.fillStyle = areaColor;
    ctx.fill();

    // Line
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const x = i * xStep;
      const y = getY(pts[i]);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Glow dot on last point
    const lastX = (pts.length - 1) * xStep;
    const lastY = getY(pts[pts.length - 1]);

    // Outer glow
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fillStyle = trend >= 0 ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)';
    ctx.fill();

    // Inner dot
    ctx.beginPath();
    ctx.arc(lastX, lastY, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();
  }
}
