import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";
import { useState } from "react";
import escapeRegExp from "lodash.escaperegexp";

type InterestingEvent = inferProcedureOutput<AppRouter["event"]["all"]>[number];

const insertHighlights = (text: string, highlight?: string) => {
  if (highlight === undefined || highlight.length == 0) return text;

  let pattern = new RegExp(escapeRegExp(highlight), 'ig');
  const arr = text.split(pattern);

  if (arr.length === 0) return text;

  let highlights = Array.from(text.matchAll(pattern));
  const elements = arr.map((val, index) => {
    return [
      <span key={val + index + 'val'}>{val}</span>,
      <span key={val + index + 'highlight'} className="bg-yellow-200">{highlights[index]}</span>
    ];
  }).flat();
  elements.pop();
  return elements;
};

const EventRow: React.FC<{
  event: InterestingEvent;
  selected: boolean;
  searchString?: string;
  selectEvent: (event: InterestingEvent) => void;
}> = ({ event, selected, searchString, selectEvent }) => {
  return (
    <tr
      className={`table-row border  border-separate ${ !selected && "hover:bg-slate-200" } ${ selected && "bg-slate-300 hover:bg-slate-400" }`}
      onClick={(e) => {
        e.preventDefault();
        selectEvent(event);
      }}
    >
      <td className="px-2 border max-w-prose w-28">{event.date.toUTCString().split('00:00:00')[0]?.slice(5)}</td>
      <td className="px-2 border max-w-prose ">{insertHighlights(event.title, searchString)}</td>
      <td className="px-2 border max-w-prose ">{insertHighlights(event.description, searchString)}</td>
    </tr>
  );
};

const Home: NextPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<InterestingEvent>();

  const [eventId, setEventId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState('');

  const [searchString, setSearchString] = useState<string>('');
  const [filterMonth, setFilterMonth] = useState(0);
  const [filterDay, setFilteredDay] = useState(0);

  const eventsQuery = trpc.event.filtered.useQuery({ month: filterMonth, day: filterDay, searchString });
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
      <main className="flex flex-col justify-between h-[100vh] p-4">
        <div className="bg-white flex-0">

          <div className="flex">
            <h1 className="mr-auto text-2xl font-bold">Edit and add interesting events in church history</h1>
            <AuthShowcase />
          </div>

          <form className="flex flex-col gap-2"
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
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="flex-1 border border-b-2" type="text" />
            </label>
            <label className="flex flex-col">
              <span>Description</span>
              <textarea rows={3}
                value={description} onChange={(event) => setDescription(event.target.value)} className="block border border-b-2" />
            </label>
            <div className="flex gap-4">
              <button type="submit"
                className="w-20 p-1 px-2 my-4 bg-green-400 border ">Save</button>
              {eventId && <button onClick={clearForm}
                className="w-20 p-1 px-2 my-4 bg-red-400 border">Cancel</button>}

              <label className="flex items-center ml-auto align-middle">
                <span>Simple search</span>
                <input type="search" value={searchString} onChange={(event) => setSearchString(event.target.value)}
                  className="px-1.5 py-1 mx-2 rounded outline outline-2 outline-gray-300 focus:outline-blue-500" placeholder="Search" />
              </label>
              <label className="flex flex-col my-4 align-middle">
                <span>Filter Month</span>
                <select value={filterMonth} name='monthFilter' id="monthFilter" onChange={(event) => setFilterMonth(Number(event.target.value))}>
                  <option value="0">None</option>
                  <option value="1">January</option>
                  <option value="2">Febuary</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>

                </select>
              </label>
              <label className="flex flex-col my-4">
                <span>Day</span>
                <select value={filterDay} onChange={(e) => setFilteredDay(Number(e.target.value))}>
                  {Array.from(Array(32).keys()).map(i => <option key={i} value={i}>{i || 'None'}</option>)}
                </select>
              </label>
            </div>

          </form>
        </div>


        <div className="flex-1 overflow-y-scroll border">
          <table className="w-full">
            <thead className="">
              <tr className="sticky top-0 bg-white">
                <th className=""><div className="pl-2 -ml-0.5 bg-gray-200 border border-r-0 border-gray-600 text-start">Date</div></th>
                <th className=""><div className="pl-2 -ml-0.5 bg-gray-200 border border-r-0 border-gray-600 text-start">Title</div></th>
                <th className=""><div className="pl-2 -ml-0.5 bg-gray-200 border border-r border-gray-600 text-start">Description</div></th>
              </tr>
            </thead>


            <tbody className="">
              {eventsQuery.data?.map((event) => {
                return (
                  <EventRow key={event.id + searchString} event={event} selected={event === selectedEvent} searchString={searchString}
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
        </div>


        <div className="flex w-full gap-4 mt-4 bg-white flex-0 ">
          <button className="w-20 bg-yellow-200 border disabled:bg-gray-400 "
            disabled={!selectedEvent}
            onClick={() => {
              if (!selectedEvent) return;
              setEventId(selectedEvent.id);
              setDate(selectedEvent.date.toISOString().split("T")[0] ?? '');
              setTitle(selectedEvent.title);
              setDescription(selectedEvent.description);
              window.scrollTo(0, 0);
            }}>Edit</button>
          <button className="w-20 bg-red-400 disabled:bg-gray-400" disabled={!selectedEvent} onClick={() => {
            deleteEvent.mutate(selectedEvent?.id ?? '');
          }}>Delete</button>
        </div>

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
        className="px-4 py-2 text-xl bg-indigo-500 border border-indigo-700 rounded-md shadow-lg text-violet-100 hover:bg-indigo-700"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
