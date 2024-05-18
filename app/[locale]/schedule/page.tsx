"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import viLocale from "date-fns/locale/vi";
import { useCallback, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarService } from "@/app/services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
const locales = {
  vi: viLocale,
};

const messages = {
  allDay: "Tất cả ngày",
  previous: "<",
  next: ">",
  today: "Hôm nay",
  month: "Tháng",
  week: "Tuần",
  day: "Ngày",
  agenda: "Chi tiết",
  noEventsInRange: "Không có sự kiện trong khoảng thời gian này",
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const EVENTS: any = [];

const Schedule: React.FC = () => {
  const [myEvents, setEvents] = useState<any>(EVENTS);
  const [open, setOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [descrip, setDescrip] = useState("");
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [id, setId] = useState("");
  const handleSelectEvent = (event: any) => {
    setEventOpen(true);
    setTitle(event.title);
    setDescrip(event.descrip);
    setId(event._id);
    console.info("[handleSelected - event]", event);
  };
  const handleSelectSlot = useCallback(
    ({ start, end }: any) => {
      setOpen(true);
      //   if (title) {
      //     setEvents((prev: any) => [...prev, { start, end, title }]);
      //   }
      setStart(start);
      setEnd(end);
    },
    [setEvents]
  );
  const queryClient = useQueryClient();
  const handleDelete = async () => {
    const result = await CalendarService.delete(id);
    toast.success("Xóa sự kiện thành công");
    queryClient.invalidateQueries({ queryKey: ["schedule"] });
  };
  const handleCreate = async () => {
    const result = await CalendarService.create({
      title: title,
      descrip: descrip,
      start: start,
      end: end,
    });
    toast.success("Tạo sự kiện thành công");
    setTitle("");
    setDescrip("");
    queryClient.invalidateQueries({ queryKey: ["schedule"] });
  };
  const handleUpdate = async () => {
    const result = await CalendarService.update(id, {
      title: title,
      descrip: descrip,
      start: start,
      end: end,
    });
    toast.success("Cập nhật sự kiện thành công");
    setTitle("");
    setDescrip("");
    queryClient.invalidateQueries({ queryKey: ["schedule"] });
  };
  const { data, isPending } = useQuery({
    queryKey: ["schedule"],
    queryFn: async () => {
      const data = await CalendarService.get();
      setEvents(data.data);
      return data;
    },
  });

  // const handleFileUpload = (event: any) => {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();

  //   reader.onload = (event) => {
  //     const binaryString = event.target.result;
  //     const workbook = XLSX.read(binaryString, { type: "binary" });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const data: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  //     const jsonData = data.slice(1).map((row: any) => {
  //       const obj = {};
  //       data[0].forEach((key: any, index: any) => {
  //         obj[key] = row[index];
  //       });
  //       return obj;
  //     });

  //     console.log(jsonData);
  //   };

  //   reader.readAsBinaryString(file);
  // };
  return (
    <div className="my-8 container text-[26px] text-slate-500 font-bold text-center uppercase">
      <div className="rounded-lg bg-white shadow-lg p-4">
        <Calendar
          className="h-full"
          messages={messages}
          localizer={localizer}
          startAccessor={(event: any) => {
            return new Date(event.start);
          }}
          endAccessor={(event: any) => {
            return new Date(event.end);
          }}
          style={{ height: 500 }}
          culture="vi"
          events={myEvents}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader className="flex justify-center w-full font-bold uppercase">
              Tạo sự kiện
            </DialogHeader>
            <DialogDescription>
              <div className="flex flex-col gap-3 text-nowrap mb-4">
                <div>Tiêu đề</div>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3 text-nowrap">
                <div>Nội dung</div>
                <Textarea
                  value={descrip}
                  onChange={(event) => setDescrip(event.target.value)}
                />
              </div>
            </DialogDescription>
            <DialogClose>
              <Button onClick={handleCreate}>Tạo</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <Dialog open={eventOpen} onOpenChange={setEventOpen}>
          <DialogContent>
            <DialogHeader className="flex justify-center w-full font-bold uppercase">
              Thông tin sự kiện
            </DialogHeader>
            <DialogDescription>
              <div className="flex flex-col gap-3 text-nowrap mb-4">
                <div>Tiêu đề</div>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3 text-nowrap">
                <div>Nội dung</div>
                <Textarea
                  value={descrip}
                  onChange={(event) => setDescrip(event.target.value)}
                />
              </div>
            </DialogDescription>
            <DialogClose>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="mr-4"
              >
                Xóa
              </Button>
              <Button onClick={handleUpdate}>Chỉnh sửa</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Schedule;
