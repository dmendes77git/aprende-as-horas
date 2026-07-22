import math
import random
from kivy.app import App
from kivy.clock import Clock
from kivy.core.text import Label as CoreLabel
from kivy.core.window import Window
from kivy.graphics import Color, Ellipse, Line, Rectangle
from kivy.properties import BooleanProperty, NumericProperty, StringProperty
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.label import Label
from kivy.uix.widget import Widget

# Set app window background to white
Window.clearcolor = (1, 1, 1, 1)


class FireworksWidget(Widget):
    """Native Kivy canvas particle engine for celebratory fireworks."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.particles = []
        self.anim_event = None

    def start_fireworks(self):
        """Spawns 100+ vibrant exploding particles across multiple burst centers."""
        self.particles = []

        # Create 3 distinct explosion centers across the window
        centers = [
            (self.width * 0.35, self.height * 0.65),
            (self.width * 0.50, self.height * 0.75),
            (self.width * 0.65, self.height * 0.65),
        ]

        # Festive particle color palette
        colors = [
            (1.0, 0.2, 0.2),   # Bright Red
            (0.1, 0.7, 1.0),   # Electric Blue
            (1.0, 0.85, 0.1),  # Gold
            (0.2, 0.9, 0.3),   # Emerald Green
            (0.9, 0.3, 0.9),   # Purple
            (1.0, 0.5, 0.1),   # Orange
        ]

        for cx, cy in centers:
            for _ in range(35):
                angle = random.uniform(0, 2 * math.pi)
                speed = random.uniform(180, 500)
                color = random.choice(colors)
                self.particles.append(
                    {
                        "x": cx,
                        "y": cy,
                        "vx": math.cos(angle) * speed,
                        "vy": math.sin(angle) * speed,
                        "color": color,
                        "size": random.uniform(8, 16),
                        "alpha": 1.0,
                        "decay": random.uniform(0.7, 1.3),
                    }
                )

        # Cancel any active animation and schedule 60 FPS particle loop
        if self.anim_event:
            self.anim_event.cancel()
        self.anim_event = Clock.schedule_interval(
            self.update_particles, 1.0 / 60.0
        )

    def update_particles(self, dt):
        """Updates particle positions, gravity, alpha decay, and renders to canvas."""
        self.canvas.clear()
        has_active_particles = False

        with self.canvas:
            for p in self.particles:
                if p["alpha"] > 0:
                    has_active_particles = True
                    # Physics update
                    p["x"] += p["vx"] * dt
                    p["y"] += p["vy"] * dt
                    p["vy"] -= 280 * dt  # Gravity effect pulling particles down
                    p["alpha"] -= p["decay"] * dt

                    alpha = max(0.0, p["alpha"])
                    Color(
                        p["color"][0], p["color"][1], p["color"][2], alpha
                    )
                    Ellipse(
                        pos=(p["x"] - p["size"] / 2, p["y"] - p["size"] / 2),
                        size=(p["size"], p["size"]),
                    )

        # Stop animation loop when all particles fade away
        if not has_active_particles:
            self.canvas.clear()
            if self.anim_event:
                self.anim_event.cancel()
                self.anim_event = None

    def on_touch_down(self, touch):
        # Allow click touches to pass through directly to buttons underneath
        return False


class HorizontalSeparator(Widget):
    """Sleek horizontal divider line."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.size_hint_y = None
        self.height = 2
        self.bind(pos=self.update_line, size=self.update_line)

    def update_line(self, *args):
        self.canvas.clear()
        with self.canvas:
            Color(0.82, 0.85, 0.90, 1)
            Rectangle(pos=self.pos, size=self.size)


class InteractiveClockWidget(Widget):
    hour = NumericProperty(3)  # 0 to 23
    minute = NumericProperty(0)  # 0 to 59
    is_pm = BooleanProperty(False)
    time_display_str = StringProperty("03:00")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.active_hand = None
        self.bind(pos=self.redraw, size=self.redraw)
        self.bind(
            hour=self.update_time_str,
            minute=self.update_time_str,
            is_pm=self.redraw,
        )

    def get_number_texture(self, text, font_size, color_rgba):
        lbl = CoreLabel(text=str(text), font_size=font_size, bold=True)
        lbl.refresh()
        return lbl.texture

    def update_time_str(self, *args):
        display_h = self.hour % 24
        self.time_display_str = f"{display_h:02d}:{self.minute:02d}"
        self.redraw()

    def redraw(self, *args):
        self.canvas.clear()

        cx, cy = self.center
        radius = min(self.width, self.height) * 0.46
        if radius <= 0:
            return

        with self.canvas:
            # Outer Drop Shadow & Rim
            Color(0.1, 0.1, 0.2, 0.08)
            Ellipse(
                pos=(cx - radius - 2, cy - radius - 6),
                size=(radius * 2 + 4, radius * 2 + 4),
            )

            if not self.is_pm:
                Color(0.2, 0.3, 0.6, 1)  # Indigo for AM
            else:
                Color(0.85, 0.35, 0.1, 1)  # Amber for PM

            Ellipse(
                pos=(cx - radius, cy - radius), size=(radius * 2, radius * 2)
            )

            # Inner Face
            Color(0.98, 0.98, 1, 1)
            inner_r = radius * 0.96
            Ellipse(
                pos=(cx - inner_r, cy - inner_r), size=(inner_r * 2, inner_r * 2)
            )

            # Minute Ticks
            for m in range(60):
                angle_rad = math.radians(90 - (m * 6))
                if m % 5 == 0:
                    r1, r2 = radius * 0.92, radius * 0.84
                    Color(0.3, 0.35, 0.45, 0.8)
                    w = 2.5
                else:
                    r1, r2 = radius * 0.92, radius * 0.88
                    Color(0.65, 0.7, 0.8, 0.5)
                    w = 1.2

                x1, y1 = cx + r1 * math.cos(angle_rad), cy + r1 * math.sin(
                    angle_rad
                )
                x2, y2 = cx + r2 * math.cos(angle_rad), cy + r2 * math.sin(
                    angle_rad
                )
                Line(points=[x1, y1, x2, y2], width=w)

            # Dynamic Numbers (1-12 in AM, 13-24 in PM)
            num_font_size = max(16, int(radius * 0.13))
            num_color = (
                (0.12, 0.18, 0.38, 1) if not self.is_pm else (0.8, 0.25, 0.05, 1)
            )

            for h in range(1, 13):
                display_num = h if not self.is_pm else (h + 12)
                angle_deg = 90 - (h * 30)
                angle_rad = math.radians(angle_deg)

                r_num = radius * 0.72
                nx = cx + r_num * math.cos(angle_rad)
                ny = cy + r_num * math.sin(angle_rad)

                tex = self.get_number_texture(
                    display_num, num_font_size, num_color
                )
                Color(num_color[0], num_color[1], num_color[2], 1)
                Rectangle(
                    texture=tex,
                    pos=(nx - tex.width / 2, ny - tex.height / 2),
                    size=tex.size,
                )

            # Minute Hand (Blue)
            min_angle = 90 - (self.minute * 6)
            min_rad = math.radians(min_angle)
            min_len = radius * 0.76
            mx = cx + min_len * math.cos(min_rad)
            my = cy + min_len * math.sin(min_rad)

            Color(0.12, 0.45, 0.95, 1)
            Line(
                points=[cx, cy, mx, my], width=max(4, int(radius * 0.025)), cap="round"
            )

            # Hour Hand (Red)
            hour_12 = self.hour % 12
            hour_angle = 90 - (hour_12 * 30 + self.minute * 0.5)
            hour_rad = math.radians(hour_angle)
            hour_len = radius * 0.50
            hx = cx + hour_len * math.cos(hour_rad)
            hy = cy + hour_len * math.sin(hour_rad)

            Color(0.9, 0.22, 0.22, 1)
            Line(
                points=[cx, cy, hx, hy], width=max(7, int(radius * 0.045)), cap="round"
            )

            # Center Pin
            Color(1, 1, 1, 1)
            Ellipse(pos=(cx - 10, cy - 10), size=(20, 20))
            Color(0.15, 0.15, 0.25, 1)
            Ellipse(pos=(cx - 6, cy - 6), size=(12, 12))

    def _get_touch_angle(self, touch):
        dx = touch.x - self.center_x
        dy = touch.y - self.center_y
        rad = math.atan2(dy, dx)
        deg = math.degrees(rad)
        return (90 - deg) % 360

    def on_touch_down(self, touch):
        if not self.collide_point(*touch.pos):
            return False

        dx = touch.x - self.center_x
        dy = touch.y - self.center_y
        dist = math.hypot(dx, dy)
        radius = min(self.width, self.height) * 0.46

        if dist < radius * 0.55:
            self.active_hand = "hour"
        elif dist < radius * 1.1:
            self.active_hand = "minute"
        else:
            self.active_hand = None

        if self.active_hand:
            self._update_hand_position(touch)
            return True
        return super().on_touch_down(touch)

    def on_touch_move(self, touch):
        if self.active_hand:
            self._update_hand_position(touch)
            return True
        return super().on_touch_move(touch)

    def on_touch_up(self, touch):
        self.active_hand = None
        return super().on_touch_up(touch)

    def _update_hand_position(self, touch):
        clock_deg = self._get_touch_angle(touch)

        if self.active_hand == "minute":
            self.minute = int(round(clock_deg / 6.0)) % 60

        elif self.active_hand == "hour":
            selected_12h = int(round(clock_deg / 30.0)) % 12
            if selected_12h == 0:
                selected_12h = 12

            if self.is_pm:
                if selected_12h == 12:
                    self.hour = 12  # Noon is 12:00
                else:
                    self.hour = selected_12h + 12
            else:
                if selected_12h == 12:
                    self.hour = 12  # 12 AM can be treated as 12 (or 0)
                else:
                    self.hour = selected_12h


class TimeTeacherApp(App):
    target_hour = 15  # Default target
    target_minute = 0
    score = NumericProperty(0)  # Game score counter
    already_scored = False  # Prevents multiple scoring on the same question

    def build(self):
        # Root layout holds the main app UI and the overlay fireworks widget
        root = FloatLayout()

        main_panel = BoxLayout(
            orientation="horizontal",
            padding=15,
            spacing=20,
            size_hint=(1, 1),
            pos_hint={"x": 0, "y": 0},
        )

        # ------------------------------------------------------------------
        # LEFT PANEL: Clock & Controls
        # ------------------------------------------------------------------
        left_panel = BoxLayout(
            orientation="vertical", size_hint=(0.52, 1), spacing=10
        )

        self.header_label = Label(
            text="Aprende as horas!",
            font_size="30sp",
            bold=True,
            size_hint=(1, 0.08),
            color=(0.12, 0.18, 0.38, 1),
        )

        self.clock_widget = InteractiveClockWidget(size_hint=(1, 0.70))

        self.digital_label = Label(
            text="Hora Digital: 03:00",
            font_size="26sp",
            bold=True,
            size_hint=(1, 0.08),
            color=(0.15, 0.2, 0.3, 1),
        )
        self.clock_widget.bind(
            time_display_str=lambda instance, val: setattr(
                self.digital_label, "text", f"Hora Digital: {val}"
            )
        )

        self.toggle_btn = Button(
            text="Modo: Manhã / AM (01:00 - 12:00)",
            size_hint=(1, 0.12),
            background_color=(0.2, 0.55, 0.9, 1),
            font_size="17sp",
            bold=True,
        )
        self.toggle_btn.bind(on_release=self.toggle_am_pm)

        left_panel.add_widget(self.header_label)
        left_panel.add_widget(self.clock_widget)
        left_panel.add_widget(self.digital_label)
        left_panel.add_widget(self.toggle_btn)

        # ------------------------------------------------------------------
        # RIGHT PANEL: Instructions, Separator, Score & Exercises
        # ------------------------------------------------------------------
        right_panel = BoxLayout(
            orientation="vertical", size_hint=(0.48, 1), spacing=10
        )

        # 1. Instructions Header
        guide_title = Label(
            text="Como ler as Horas?",
            font_size="24sp",
            bold=True,
            size_hint=(1, 0.07),
            color=(0.1, 0.2, 0.5, 1),
            halign="left",
        )
        guide_title.bind(size=guide_title.setter("text_size"))

        # 2. Instruction Text with custom markup bullets
        explanation_text = (
            "[color=e53935]●[/color] [b]Ponteiro VERMELHO (Curto):[/b] Aponta para as HORAS.\n"
            "[color=1e88e5]●[/color] [b]Ponteiro AZUL (Longo):[/b] Aponta para os MINUTOS.\n"
            "[color=fbc02d]●[/color] [b]Modo AM (Manhã):[/b] Usa números de 1 a 12.\n"
            "[color=f57c00]●[/color] [b]Modo PM (Tarde):[/b] Soma 12 às horas (13h-24h)!"
        )

        self.guide_label = Label(
            text=explanation_text,
            markup=True,
            font_size="16sp",
            size_hint=(1, 0.28),
            color=(0.2, 0.2, 0.3, 1),
            valign="top",
            halign="left",
        )
        self.guide_label.bind(size=self.guide_label.setter("text_size"))

        # 3. Separator
        separator = HorizontalSeparator()

        # 4. Exercise Section Header & Score Display
        exercise_header_box = BoxLayout(
            orientation="horizontal", size_hint=(1, 0.08)
        )

        exercise_title = Label(
            text="Exercícios de Treino",
            font_size="22sp",
            bold=True,
            size_hint=(0.6, 1),
            color=(0.85, 0.35, 0.1, 1),
            halign="left",
        )
        exercise_title.bind(size=exercise_title.setter("text_size"))

        self.score_label = Label(
            text="Pontos: 0",
            font_size="22sp",
            bold=True,
            size_hint=(0.4, 1),
            color=(0.1, 0.65, 0.25, 1),
            halign="right",
        )
        self.score_label.bind(size=self.score_label.setter("text_size"))

        exercise_header_box.add_widget(exercise_title)
        exercise_header_box.add_widget(self.score_label)

        # 5. Challenge Prompt Label
        self.challenge_label = Label(
            text="Desafio: Mova os ponteiros para mostrar [b]15:00[/b] (3 horas da tarde)!",
            markup=True,
            font_size="17sp",
            size_hint=(1, 0.14),
            color=(0.1, 0.1, 0.1, 1),
            valign="center",
            halign="left",
        )
        self.challenge_label.bind(size=self.challenge_label.setter("text_size"))

        # 6. Check Answer Button
        self.check_btn = Button(
            text="Verificar Resposta!",
            size_hint=(1, 0.11),
            background_color=(0.15, 0.70, 0.30, 1),
            font_size="18sp",
            bold=True,
        )
        self.check_btn.bind(on_release=self.check_answer)

        # 7. New Exercise Button
        self.new_exercise_btn = Button(
            text="Novo Desafio",
            size_hint=(1, 0.09),
            background_color=(0.35, 0.38, 0.48, 1),
            font_size="16sp",
            bold=True,
        )
        self.new_exercise_btn.bind(on_release=self.generate_new_exercise)

        # 8. Feedback Output Label
        self.feedback_label = Label(
            text="",
            font_size="17sp",
            bold=True,
            size_hint=(1, 0.11),
            color=(0.1, 0.5, 0.2, 1),
            halign="left",
        )
        self.feedback_label.bind(size=self.feedback_label.setter("text_size"))

        # Build Right Panel
        right_panel.add_widget(guide_title)
        right_panel.add_widget(self.guide_label)
        right_panel.add_widget(separator)
        right_panel.add_widget(exercise_header_box)
        right_panel.add_widget(self.challenge_label)
        right_panel.add_widget(self.check_btn)
        right_panel.add_widget(self.new_exercise_btn)
        right_panel.add_widget(self.feedback_label)

        # Add left and right panels to main UI container
        main_panel.add_widget(left_panel)
        main_panel.add_widget(right_panel)

        # Fireworks overlay
        self.fireworks = FireworksWidget(
            size_hint=(1, 1), pos_hint={"x": 0, "y": 0}
        )

        root.add_widget(main_panel)
        root.add_widget(self.fireworks)

        return root

    def toggle_am_pm(self, instance):
        self.clock_widget.is_pm = not self.clock_widget.is_pm
        if self.clock_widget.is_pm:
            if self.clock_widget.hour <= 12 and self.clock_widget.hour != 12:
                self.clock_widget.hour += 12
            self.toggle_btn.text = "Modo: Tarde/Noite / PM (13:00 - 24:00)"
            self.toggle_btn.background_color = (0.9, 0.4, 0.15, 1)
        else:
            if self.clock_widget.hour > 12:
                self.clock_widget.hour -= 12
            self.toggle_btn.text = "Modo: Manhã / AM (01:00 - 12:00)"
            self.toggle_btn.background_color = (0.2, 0.55, 0.9, 1)

    def check_answer(self, instance):
        """Validates current hand positions, updates score (+5 pts), triggers fireworks."""
        user_hour = self.clock_widget.hour
        user_minute = self.clock_widget.minute

        # Accept matching hours (e.g. 15 == 15, or 3 with PM mode active when target is 15)
        is_hour_correct = (user_hour == self.target_hour) or (
            self.target_hour > 12 and self.clock_widget.is_pm and (user_hour + 12 == self.target_hour or user_hour == self.target_hour)
        ) or (
            self.target_hour == 12 and user_hour == 12
        )

        if is_hour_correct and user_minute == self.target_minute:
            if not self.already_scored:
                self.score += 5
                self.already_scored = True
                self.score_label.text = f"Pontos: {self.score}"
                self.feedback_label.text = "Muito bem! Ganhaste +5 pontos!"
            else:
                self.feedback_label.text = "Excelente! Já acertaste esta pergunta!"

            self.feedback_label.color = (0.1, 0.65, 0.2, 1)
            # Trigger celebration fireworks!
            self.fireworks.start_fireworks()
        else:
            self.feedback_label.text = (
                f"Tenta outra vez! Procuras {self.target_hour:02d}:{self.target_minute:02d}."
            )
            self.feedback_label.color = (0.85, 0.2, 0.1, 1)

    def generate_new_exercise(self, instance):
        """Generates a new random time prompt and resets scoring state."""
        self.already_scored = False

        sample_times = [
            (3, 0, "3:00 da manhã"),
            (15, 0, "3:00 da tarde"),
            (8, 0, "8:00 da manhã"),
            (20, 0, "8:00 da noite"),
            (12, 0, "12:00 Meio-dia"),
            (14, 30, "2:30 da tarde"),
            (18, 0, "6:00 da tarde"),
            (21, 0, "9:00 da noite"),
        ]

        self.target_hour, self.target_minute, label_desc = random.choice(
            sample_times
        )

        self.challenge_label.text = (
            f"Desafio: Mova os ponteiros para mostrar [b]{self.target_hour:02d}:{self.target_minute:02d}[/b] ({label_desc})!"
        )
        self.feedback_label.text = ""


if __name__ == "__main__":
    TimeTeacherApp().run()
