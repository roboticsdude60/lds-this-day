import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";
import { useState } from "react";

type InterestingEvent = inferProcedureOutput<AppRouter["event"]["all"]>[number];

const EventRow: React.FC<{
  event: InterestingEvent;
  selected: boolean;
  selectEvent: (event: InterestingEvent) => void;
}> = ({ event, selected, selectEvent }) => {
  return (
    <tr
      className={`table-row border  border-separate ${!selected && "hover:bg-slate-200"} ${selected && "bg-slate-300 hover:bg-slate-400"}`}
      onClick={(e) => {
        e.preventDefault();
        selectEvent(event);
      }}
    >
      <td className="border px-2 max-w-prose w-28">{event.date.toUTCString().split('00:00:00')[0]?.slice(5)}</td>
      <td className="border px-2 max-w-prose ">{event.title}</td>
      <td className="border px-2 max-w-prose ">{event.description}</td>
    </tr>
  );
}

const Home: NextPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<InterestingEvent>();

  const [eventId, setEventId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState('');

  const eventsQuery = trpc.event.all.useQuery();
  const addEvent = trpc.event.create.useMutation({
    onSuccess() {
      eventsQuery.refetch();
      clearForm();
    },
  });
  const updateEvent = trpc.event.patchById.useMutation({
    onSuccess() {
      eventsQuery.refetch();
      clearForm();
    },
  });
  const deleteEvent = trpc.event.deleteById.useMutation({
    onSuccess() {
      eventsQuery.refetch();
    },
  });

  function clearForm() {
    setEventId('');
    setDescription('');
    setTitle('');
    setDate('');
  }



  return (
    <>
      <Head>
        <title>This day in LDS history</title>
        <meta name="description" content="what happened??" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col p-4">
        <div className="flex-1 bg-white">

          <div className="flex">
            <h1 className="font-bold text-2xl mr-auto">Edit and add interesting events in church history</h1>
            <AuthShowcase />
          </div>

          <form className="flex gap-2 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              if (!date || !title) return;

              if (eventId) {
                updateEvent.mutate({ id: eventId, date: new Date(date), title, description, tags: [] });
              } else addEvent.mutate({ date: new Date(date), title, description, tags: [] });
            }}
          >
            <label className="flex">
              <span className="w-12">Date</span>
              <input value={date} onChange={(event) => setDate(event.target.value)}
                className="border border-b-2" type="date" />
            </label>
            <label className="flex">
              <span className="w-12">Title</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} id="titleField" className="flex-1 border border-b-2" type="text" />
            </label>
            <label className="flex flex-col">
              <span>Description</span>
              <textarea rows={3}
                value={description} onChange={(event) => setDescription(event.target.value)} className="mycool block border border-b-2" />
            </label>
            <div className="flex gap-4">
              <button type="submit"
                className=" my-4 w-20 px-2 p-1 border bg-green-400">Save</button>
              {eventId && <button onClick={clearForm}
                className="my-4 w-20 px-2 p-1 border bg-red-400">Cancel</button>}
            </div>

          </form>
        </div>


        <table className="w-full ">
          <thead className="">
            <tr className="border border-slate-500 ">
              <th className="sticky top-0 bg-white drop-shadow-sm pl-2 border text-start">Date</th>
              <th className="sticky top-0 bg-white drop-shadow-sm pl-2 border text-start">Title</th>
              <th className="sticky top-0 bg-white drop-shadow-sm pl-2 border text-start">Description</th>
            </tr>
          </thead>


          <tbody className="border border-1 border-collapse border-gray h-[20vh] overflow-y-scroll">
            {eventsQuery.data?.map((event) => {
              return (
                <EventRow key={event.id} event={event} selected={event === selectedEvent}
                  selectEvent={(event) => {
                    if (event === selectedEvent) {
                      setSelectedEvent(undefined);
                    } else setSelectedEvent(event);
                  }}
                />
              );
            })}
          </tbody>
        </table>


        {
          selectedEvent && <div className="py-4 w-full bg-white flex gap-4 sticky bottom-0">
            <button className="w-20 bg-yellow-200 border"
              onClick={() => {
                if (!selectedEvent) return;
                setEventId(selectedEvent.id);
                setDate(selectedEvent.date.toISOString().split("T")[0] ?? '');
                setTitle(selectedEvent.title);
                setDescription(selectedEvent.description);
                window.scrollTo(0, 0);
              }}>Edit</button>
            <button className="w-20 bg-red-400" onClick={() => {
              deleteEvent.mutate(selectedEvent.id);
            }}>Delete</button>
          </div>
        }
      </main >
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = trpc.auth.getSession.useQuery();

  return (
    <div className="flex items-center justify-between gap-8">
      {sessionData && (
        <div>
          <p className="text-2xl text-indigo-500">
            Logged in as {sessionData?.user?.name}
          </p>
          <p className="text-sm text-gray-500">Id: {sessionData?.user?.id}</p>
        </div>
      )}
      <button
        className="rounded-md border border-indigo-700 bg-indigo-500 px-4 py-2 text-xl shadow-lg text-violet-100 hover:bg-indigo-700"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
