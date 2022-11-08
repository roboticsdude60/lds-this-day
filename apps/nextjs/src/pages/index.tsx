import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";
import { useState } from "react";

// const PostCard: React.FC<{
//   post: inferProcedureOutput<AppRouter["post"]["all"]>[number];
// }> = ({ post }) => {
//   return (
//     <div className="p-4 border-2 border-gray-500 rounded-lg max-w-2xl hover:scale-[101%] transition-all">
//       <h2 className="text-2xl font-bold text-gray-800">{post.title}</h2>
//       <p className="text-gray-600">{post.content}</p>
//     </div>
//   );
// };

const EventRow: React.FC<{
  event: inferProcedureOutput<AppRouter["event"]["all"]>[number];
  selected: boolean;
  selectEvent: (eventId: string) => void;
}> = ({ event, selected, selectEvent }) => {
  return (
    <tr
      className={`flex-1 table-row  ${!selected && "hover:bg-slate-200"} ${selected && "bg-slate-300 hover:bg-slate-400"}`}
      onClick={(e) => {
        e.preventDefault();
        selectEvent(event.id);
      }}
    >
      <td className="">{event.title}</td>
      <td className="">{event.date.toUTCString()}</td>
      <td className="flex-1">{event.description}</td>
    </tr>
  );
}

const Home: NextPage = () => {
  // const postQuery = trpc.post.all.useQuery();
  const eventsQuery = trpc.event.all.useQuery();
  const [selectedEvent, setSelectedEvent] = useState('');

  const [date, setDate] = useState<string | undefined>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const addEvent = trpc.event.create.useMutation({
    onSuccess() {
      eventsQuery.refetch();
    },
  });
  const deleteEvent = trpc.event.deleteById.useMutation({
    onSuccess() {
      eventsQuery.refetch();
    },
  });



  return (
    <>
      <Head>
        <title>This day in LDS history</title>
        <meta name="description" content="what happened??" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <div className="flex m-4">
          <h1 className="font-bold text-2xl mr-auto">Edit and add interesting events in church history</h1>
          <AuthShowcase />
        </div>

        <form className="m-4 flex gap-2 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            if (!date) return;
            addEvent.mutate({ date: new Date(date,), description, tags: [], title });
            setDescription('');
            setTitle('');
            setDate('');
          }}
        >
          <div className="flex">
            <label className="w-12">Date</label>
            <input value={date} onChange={(event) => setDate(event.target.value)}
              className="border border-b-2" type="date" />
          </div>
          <div className="flex">
            <label className="w-12">Title</label>
            <input value={title} onChange={(event) => setTitle(event.target.value)} id="titleField" className="flex-1 border border-b-2" type="text" />
          </div>
          <div className="flex flex-col">
            <label>Description</label>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="flex-1 border border-b-2 m-1 " />
          </div>
          <button type="submit"
            className="w-20 border bg-green-400">Save</button>
        </form>


        {/* <div className="m-4"> */}
        <table className="m-4 border border-slate-500">
          <thead>
            <tr>
              <th className="text-start">Title</th>
              <th className="text-start">Date</th>
              <th className="text-start">Description</th>
            </tr>
          </thead>

          <tbody>
            {eventsQuery.data?.map((event) => {
              return (
                <EventRow key={event.id} event={event} selected={event.id === selectedEvent}
                  selectEvent={(eventId) => {
                    if (eventId === selectedEvent) {
                      setSelectedEvent('');
                    } else setSelectedEvent(eventId);
                  }}
                />
              );
            })}
          </tbody>
        </table>
        {/* </div> */}
        {selectedEvent && <div className="m-4 flex gap-4">
          <button className="w-20 bg-yellow-200 border">Edit (TODO)</button>
          <button className="w-20 bg-red-400" onClick={() => {
            deleteEvent.mutate(selectedEvent);
          }}>Delete</button>
        </div>}
      </main>


      {/* <main className="container flex flex-col items-center min-h-screen py-16 mx-auto">
        <h1 className="text-8xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Create <span className="text-indigo-500">T3</span> Turbo
        </h1>
        <AuthShowcase />

        <div className="flex items-center justify-center w-full pt-6 text-2xl text-blue-500">
          {postQuery.data ? (
            <div className="flex flex-col gap-4">
              {postQuery.data?.map((p) => {
                return <PostCard key={p.id} post={p} />;
              })}
            </div>
          ) : (
            <p>Loading..</p>
          )}
        </div>
      </main> */}
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
