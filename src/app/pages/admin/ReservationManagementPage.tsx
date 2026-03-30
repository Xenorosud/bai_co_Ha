import { useState } from "react";
import { Calendar as CalendarIcon, Check, X, Clock, Users, Phone } from "lucide-react";
import { toast } from "sonner";

interface Reservation {
  id: number;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  higherTable: boolean;
  specialRequests: string;
  status: "Pending" | "Approved" | "Denied";
  submittedAt: string;
}

export function ReservationManagementPage() {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 1,
      customerName: "John Doe",
      phone: "(555) 123-4567",
      email: "john@example.com",
      date: "2026-04-05",
      time: "19:00",
      guests: 4,
      higherTable: true,
      specialRequests: "Celebrating anniversary, would like a quiet table",
      status: "Pending",
      submittedAt: "2026-03-30 10:30 AM",
    },
    {
      id: 2,
      customerName: "Sarah Smith",
      phone: "(555) 234-5678",
      email: "sarah@example.com",
      date: "2026-04-02",
      time: "18:30",
      guests: 2,
      higherTable: false,
      specialRequests: "",
      status: "Approved",
      submittedAt: "2026-03-29 14:20 PM",
    },
    {
      id: 3,
      customerName: "Mike Johnson",
      phone: "(555) 345-6789",
      email: "mike@example.com",
      date: "2026-04-03",
      time: "20:00",
      guests: 6,
      higherTable: false,
      specialRequests: "Birthday celebration, need high chair for toddler",
      status: "Pending",
      submittedAt: "2026-03-30 09:15 AM",
    },
    {
      id: 4,
      customerName: "Emily Brown",
      phone: "(555) 456-7890",
      email: "emily@example.com",
      date: "2026-04-01",
      time: "19:30",
      guests: 8,
      higherTable: true,
      specialRequests: "Business dinner, need private area if available",
      status: "Approved",
      submittedAt: "2026-03-28 16:45 PM",
    },
    {
      id: 5,
      customerName: "David Lee",
      phone: "(555) 567-8901",
      email: "david@example.com",
      date: "2026-03-31",
      time: "18:00",
      guests: 3,
      higherTable: false,
      specialRequests: "Vegetarian menu preferred",
      status: "Denied",
      submittedAt: "2026-03-30 08:00 AM",
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const handleApprove = (id: number) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status: "Approved" as const } : res
    ));
    toast.success("Reservation approved successfully!");
    setSelectedReservation(null);
  };

  const handleDeny = (id: number) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status: "Denied" as const } : res
    ));
    toast.success("Reservation denied");
    setSelectedReservation(null);
  };

  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "Denied":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const filteredReservations = reservations.filter(res => 
    statusFilter === "All" || res.status === statusFilter
  );

  const statusCounts = {
    All: reservations.length,
    Pending: reservations.filter(r => r.status === "Pending").length,
    Approved: reservations.filter(r => r.status === "Approved").length,
    Denied: reservations.filter(r => r.status === "Denied").length,
  };

  // Group reservations by date
  const groupedReservations = filteredReservations.reduce((acc, res) => {
    if (!acc[res.date]) {
      acc[res.date] = [];
    }
    acc[res.date].push(res);
    return acc;
  }, {} as Record<string, Reservation[]>);

  const sortedDates = Object.keys(groupedReservations).sort();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reservation Management</h1>
        <p className="text-gray-600">View booking schedule and manage reservations</p>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Reservations by Date */}
      <div className="space-y-6">
        {sortedDates.map((date) => (
          <div key={date} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-amber-600 text-white px-6 py-4 flex items-center gap-3">
              <CalendarIcon className="w-5 h-5" />
              <h2 className="text-xl font-bold">
                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              <span className="ml-auto bg-white text-amber-600 px-3 py-1 rounded-full text-sm font-semibold">
                {groupedReservations[date].length} reservations
              </span>
            </div>

            <div className="divide-y divide-gray-200">
              {groupedReservations[date].map((reservation) => (
                <div key={reservation.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{reservation.customerName}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{reservation.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{reservation.guests} guests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{reservation.phone}</span>
                        </div>
                      </div>

                      {reservation.higherTable && (
                        <div className="inline-block bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded text-xs font-medium mb-2">
                          Higher Table Requested
                        </div>
                      )}

                      {reservation.specialRequests && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                          <p className="font-medium mb-1">Special Requests:</p>
                          <p>{reservation.specialRequests}</p>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-2">
                        Submitted: {reservation.submittedAt}
                      </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {reservation.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(reservation.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleDeny(reservation.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Deny
                          </button>
                        </>
                      )}
                      {reservation.status === "Approved" && (
                        <button
                          onClick={() => handleDeny(reservation.id)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {sortedDates.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No reservations found</p>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
          <p className="text-3xl font-bold text-yellow-700">{statusCounts.Pending}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-700">{statusCounts.Approved}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Denied</p>
          <p className="text-3xl font-bold text-red-700">{statusCounts.Denied}</p>
        </div>
      </div>
    </div>
  );
}
