import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function CalendarView({ bookings }: any) {

  // ✅ Convert your API data → calendar events
  const events = bookings.map((b: any) => ({
    title: `${b.reason} - ${b.user_name}`,
    start: new Date(`${b.date}T${b.start_time}`),
    end: new Date(`${b.date}T${b.end_time}`),
  }));

  return (
    <div style={{ height: "90vh", padding: "10px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"

        views={["day", "week", "month"]}
        defaultView="week"

        style={{
          height: "100%",
          background: "#fff",
          borderRadius: "10px",
          padding: "10px",
        }}
      />
    </div>
  );
}