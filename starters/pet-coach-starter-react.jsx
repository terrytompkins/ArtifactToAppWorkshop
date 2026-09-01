import { useState } from "react";

const SPECIES_EMOJI = { Dog: "🐕", Cat: "🐈", Rabbit: "🐇" };

const URGENCY_STYLES = {
  Low: "bg-emerald-100 text-emerald-800",
  Moderate: "bg-amber-100 text-amber-800",
  High: "bg-red-100 text-red-700",
};

const STATUS_STYLES = {
  Upcoming: "bg-teal-100 text-teal-800",
  Completed: "bg-gray-200 text-gray-600",
  Cancelled: "bg-gray-100 text-gray-500 line-through",
};

const metaLine = (pet) => [pet.species, pet.breed, pet.age].filter(Boolean).join(" · ");

const initialPets = [
  {
    id: 1,
    name: "Maple",
    species: "Dog",
    breed: "Lab mix",
    age: "6y",
    reports: [
      {
        id: 101,
        date: "2026-08-18",
        symptoms:
          "Low energy and eating less than usual. Skipped breakfast. No vomiting, drinking normally.",
        duration: "About 24 hours",
        urgency: "Moderate",
      },
      {
        id: 102,
        date: "2026-06-02",
        symptoms: "Mild limp on front left leg after a long dog-park session.",
        duration: "2 days",
        urgency: "Low",
      },
    ],
    appointments: [
      {
        id: 201,
        visitType: "Sick visit",
        when: "2026-08-20 · 10:30 AM",
        vet: "Dr. Patel",
        status: "Upcoming",
        promptedBy: 101,
      },
      {
        id: 202,
        visitType: "Wellness check",
        when: "2026-03-14 · 9:00 AM",
        vet: "Dr. Chen",
        status: "Completed",
        promptedBy: null,
      },
    ],
  },
  {
    id: 2,
    name: "Juniper",
    species: "Cat",
    breed: "Domestic shorthair",
    age: "3y",
    reports: [
      {
        id: 103,
        date: "2026-08-15",
        symptoms: "Coughing more than usual, especially in the evening.",
        duration: "4 days",
        urgency: "Moderate",
      },
    ],
    appointments: [
      {
        id: 203,
        visitType: "Sick visit",
        when: "2026-08-25 · 2:15 PM",
        vet: "Dr. Patel",
        status: "Upcoming",
        promptedBy: 103,
      },
    ],
  },
  {
    id: 3,
    name: "Biscuit",
    species: "Rabbit",
    breed: "Holland Lop",
    age: "2y",
    reports: [],
    appointments: [],
  },
];

function Tag({ value, styles }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        styles[value] || "bg-gray-100 text-gray-600"
      }`}
    >
      {value}
    </span>
  );
}

function PetCard({ pet, onOpen }) {
  return (
    <button
      onClick={() => onOpen(pet.id)}
      className="w-full rounded-2xl border border-teal-100 bg-white p-5 text-left shadow-sm transition hover:border-teal-300 hover:shadow"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-2xl ring-2 ring-teal-200">
          {SPECIES_EMOJI[pet.species] || "🐾"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-lg font-bold text-gray-900">{pet.name}</div>
          <div className="truncate text-sm text-gray-500">{metaLine(pet)}</div>
        </div>
        <div className="text-right text-xs text-gray-400">
          <div>{pet.reports.length} report{pet.reports.length === 1 ? "" : "s"}</div>
          <div>
            {pet.appointments.length} appointment
            {pet.appointments.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>
    </button>
  );
}

function AddPetForm({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("Dog");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), species, breed: breed.trim(), age: age.trim() });
    onClose();
  };

  return (
    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
      <div className="mb-3 text-sm font-bold text-teal-900">Add a pet</div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
        >
          <option>Dog</option>
          <option>Cat</option>
          <option>Rabbit</option>
          <option>Other</option>
        </select>
        <input
          className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm"
          placeholder="Breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />
        <input
          className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm"
          placeholder="Age (e.g. 4y)"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={submit}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Save pet
        </button>
        <button
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function ReportForm({ onAdd, onClose }) {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [urgency, setUrgency] = useState("Low");

  const submit = () => {
    if (!symptoms.trim()) return;
    onAdd({
      date: new Date().toISOString().slice(0, 10),
      symptoms: symptoms.trim(),
      duration: duration.trim(),
      urgency,
    });
    onClose();
  };

  return (
    <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
      <textarea
        className="w-full rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm"
        rows={3}
        placeholder="What have you noticed? (symptoms, behavior changes…)"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <input
          className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm"
          placeholder="How long? (e.g. 2 days)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <select
          className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm"
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
        >
          <option>Low</option>
          <option>Moderate</option>
          <option>High</option>
        </select>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={submit}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Log report
        </button>
        <button
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function AppointmentForm({ reports, onAdd, onClose }) {
  const [visitType, setVisitType] = useState("Wellness check");
  const [when, setWhen] = useState("");
  const [vet, setVet] = useState("");
  const [promptedBy, setPromptedBy] = useState("");

  const submit = () => {
    if (!when.trim()) return;
    onAdd({
      visitType,
      when: when.trim(),
      vet: vet.trim() || "Any available vet",
      status: "Upcoming",
      promptedBy: promptedBy ? Number(promptedBy) : null,
    });
    onClose();
  };

  return (
    <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <select
          className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm"
          value={visitType}
          onChange={(e) => setVisitType(e.target.value)}
        >
          <option>Wellness check</option>
          <option>Sick visit</option>
          <option>Same-day urgent visit</option>
          <option>Follow-up visit</option>
        </select>
        <input
          className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm"
          placeholder="When (e.g. 2026-09-02 · 9:00 AM)"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
        />
        <input
          className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm"
          placeholder="Preferred vet (optional)"
          value={vet}
          onChange={(e) => setVet(e.target.value)}
        />
        <select
          className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm"
          value={promptedBy}
          onChange={(e) => setPromptedBy(e.target.value)}
        >
          <option value="">Not related to a report</option>
          {reports.map((r) => (
            <option key={r.id} value={r.id}>
              Prompted by report from {r.date}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={submit}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Schedule
        </button>
        <button
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function PetDetail({ pet, onBack, onAddReport, onAddAppointment }) {
  const [showReportForm, setShowReportForm] = useState(false);
  const [showApptForm, setShowApptForm] = useState(false);

  const reportById = (id) => pet.reports.find((r) => r.id === id);

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 text-sm font-semibold text-teal-700 hover:text-teal-900"
      >
        ← All pets
      </button>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-3xl ring-2 ring-teal-200">
          {SPECIES_EMOJI[pet.species] || "🐾"}
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">{pet.name}</h2>
          <div className="text-sm text-gray-500">{metaLine(pet)}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Symptom log
            </h3>
            <button
              onClick={() => setShowReportForm((open) => !open)}
              className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
            >
              + Log symptoms
            </button>
          </div>
          {showReportForm && (
            <div className="mb-3">
              <ReportForm
                onAdd={(r) => onAddReport(pet.id, r)}
                onClose={() => setShowReportForm(false)}
              />
            </div>
          )}
          <div className="space-y-3">
            {pet.reports.length === 0 && !showReportForm && (
              <div className="rounded-xl border border-dashed border-teal-200 p-5 text-center text-sm text-gray-400">
                Nothing logged yet. When something seems off, log it here.
              </div>
            )}
            {pet.reports.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400">
                    {r.date}
                  </span>
                  <Tag value={r.urgency} styles={URGENCY_STYLES} />
                </div>
                <p className="text-sm text-gray-800">{r.symptoms}</p>
                {r.duration && (
                  <p className="mt-1 text-xs text-gray-400">
                    Duration: {r.duration}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Appointments
            </h3>
            <button
              onClick={() => setShowApptForm((open) => !open)}
              className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
            >
              + Schedule
            </button>
          </div>
          {showApptForm && (
            <div className="mb-3">
              <AppointmentForm
                reports={pet.reports}
                onAdd={(a) => onAddAppointment(pet.id, a)}
                onClose={() => setShowApptForm(false)}
              />
            </div>
          )}
          <div className="space-y-3">
            {pet.appointments.length === 0 && !showApptForm && (
              <div className="rounded-xl border border-dashed border-teal-200 p-5 text-center text-sm text-gray-400">
                No appointments yet.
              </div>
            )}
            {pet.appointments.map((a) => {
              const related = a.promptedBy ? reportById(a.promptedBy) : null;
              return (
                <div
                  key={a.id}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">
                      {a.visitType}
                    </span>
                    <Tag value={a.status} styles={STATUS_STYLES} />
                  </div>
                  <div className="text-sm text-gray-600">{a.when}</div>
                  <div className="text-xs text-gray-400">{a.vet}</div>
                  {related && (
                    <div className="mt-2 rounded-lg bg-teal-50 px-3 py-1.5 text-xs text-teal-800">
                      Prompted by report from {related.date}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function PetCoach() {
  const [pets, setPets] = useState(initialPets);
  const [view, setView] = useState("list");
  const [showAddPet, setShowAddPet] = useState(false);

  const addPet = (fields) => {
    setPets((prev) => [
      ...prev,
      { id: Date.now(), reports: [], appointments: [], ...fields },
    ]);
  };

  const addReport = (petId, report) => {
    setPets((prev) =>
      prev.map((p) =>
        p.id === petId
          ? { ...p, reports: [{ id: Date.now(), ...report }, ...p.reports] }
          : p
      )
    );
  };

  const addAppointment = (petId, appt) => {
    setPets((prev) =>
      prev.map((p) =>
        p.id === petId
          ? {
              ...p,
              appointments: [{ id: Date.now(), ...appt }, ...p.appointments],
            }
          : p
      )
    );
  };

  const openPet = (id) => {
    setShowAddPet(false);
    setView(id);
  };

  const activePet = view === "list" ? null : pets.find((p) => p.id === view);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white font-sans">
      <div className="mx-auto max-w-4xl px-5 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-xl text-white shadow">
              🐾
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
                Pet Care Coach
              </h1>
              <div className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                v1 · Health records
              </div>
            </div>
          </div>
          {view === "list" && (
            <button
              onClick={() => setShowAddPet((open) => !open)}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-teal-700"
            >
              + Add pet
            </button>
          )}
        </header>

        {view === "list" ? (
          <div className="space-y-4">
            {showAddPet && (
              <AddPetForm onAdd={addPet} onClose={() => setShowAddPet(false)} />
            )}
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} onOpen={openPet} />
            ))}
          </div>
        ) : (
          activePet && (
            <PetDetail
              pet={activePet}
              onBack={() => setView("list")}
              onAddReport={addReport}
              onAddAppointment={addAppointment}
            />
          )
        )}

        <footer className="mt-12 border-t border-teal-100 pt-4 text-center text-xs text-gray-400">
          Pet Care Coach is a fictional product used for class purposes. It does
          not replace veterinary care — urgent or worsening symptoms should go
          to your clinic or an emergency veterinary service.
        </footer>
      </div>
    </div>
  );
}
