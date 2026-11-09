/**
 * RailYatra - Indian Railway Simulator Data Model
 * Sample stations and train database covering Indian Railways routes
 * IMPORTANT: SIMULATED GAME DATA - NOT OFFICIAL IRCTC OR INDIAN RAILWAYS INFORMATION
 */

const STATIONS = [
  { code: "BZA", name: "Vijayawada Junction", city: "Vijayawada", state: "Andhra Pradesh", zone: "SCR" },
  { code: "GNT", name: "Guntur Junction", city: "Guntur", state: "Andhra Pradesh", zone: "SCR" },
  { code: "HYB", name: "Hyderabad Deccan", city: "Hyderabad", state: "Telangana", zone: "SCR" },
  { code: "SC",  name: "Secunderabad Junction", city: "Hyderabad / Secunderabad", state: "Telangana", zone: "SCR" },
  { code: "MAS", name: "Chennai Central (MGR)", city: "Chennai", state: "Tamil Nadu", zone: "SR" },
  { code: "SBC", name: "KSR Bengaluru City", city: "Bengaluru", state: "Karnataka", zone: "SWR" },
  { code: "VSKP", name: "Visakhapatnam Junction", city: "Visakhapatnam", state: "Andhra Pradesh", zone: "ECoR" },
  { code: "TPTY", name: "Tirupati", city: "Tirupati", state: "Andhra Pradesh", zone: "SCR" },
  { code: "NDLS", name: "New Delhi", city: "New Delhi", state: "Delhi", zone: "NR" },
  { code: "MMCT", name: "Mumbai Central", city: "Mumbai", state: "Maharashtra", zone: "WR" },
  { code: "HWH", name: "Howrah Junction", city: "Kolkata", state: "West Bengal", zone: "ER" },
  { code: "PNBE", name: "Patna Junction", city: "Patna", state: "Bihar", zone: "ECR" },
  { code: "ERS", name: "Kochi Ernakulam Junction", city: "Kochi", state: "Kerala", zone: "SR" },
  { code: "MYS", name: "Mysuru Junction", city: "Mysuru", state: "Karnataka", zone: "SWR" },
  { code: "PUNE", name: "Pune Junction", city: "Pune", state: "Maharashtra", zone: "CR" }
];

const TRAIN_DATABASE = [
  {
    number: "12727",
    name: "Godavari Superfast Express",
    type: "Superfast Express",
    badgeColor: "#1a5276",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pantry: true,
    speedKmH: 75,
    stops: [
      { code: "VSKP", name: "Visakhapatnam", day: 1, arr: "Source", dep: "17:20", km: 0 },
      { code: "BZA",  name: "Vijayawada Jn", day: 1, arr: "23:30", dep: "23:45", km: 350 },
      { code: "SC",   name: "Secunderabad Jn", day: 2, arr: "05:15", dep: "05:20", km: 699 },
      { code: "HYB",  name: "Hyderabad Deccan", day: 2, arr: "06:15", dep: "Destination", km: 709 }
    ],
    classes: ["1A", "2A", "3A", "SL"],
    baseFares: { "1A": 2450, "2A": 1490, "3A": 1050, "SL": 395 },
    availability: {
      "1A": { status: "AVL 04", count: 4, type: "AVAILABLE", color: "green" },
      "2A": { status: "AVL 16", count: 16, type: "AVAILABLE", color: "green" },
      "3A": { status: "AVL 52", count: 52, type: "AVAILABLE", color: "green" },
      "SL": { status: "RAC 18 / RAC 12", count: 0, type: "RAC", color: "amber" }
    }
  },
  {
    number: "12704",
    name: "Falaknuma Superfast Express",
    type: "Superfast Express",
    badgeColor: "#1a5276",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pantry: true,
    speedKmH: 72,
    stops: [
      { code: "SC",   name: "Secunderabad Jn", day: 1, arr: "Source", dep: "15:55", km: 0 },
      { code: "GNT",  name: "Guntur Jn", day: 1, arr: "20:20", dep: "20:30", km: 281 },
      { code: "BZA",  name: "Vijayawada Jn", day: 1, arr: "21:30", dep: "21:45", km: 313 },
      { code: "VSKP", name: "Visakhapatnam", day: 2, arr: "03:25", dep: "03:45", km: 663 },
      { code: "HWH",  name: "Howrah Jn", day: 2, arr: "17:40", dep: "Destination", km: 1545 }
    ],
    classes: ["1A", "2A", "3A", "SL"],
    baseFares: { "1A": 4650, "2A": 2750, "3A": 1920, "SL": 735 },
    availability: {
      "1A": { status: "AVL 02", count: 2, type: "AVAILABLE", color: "green" },
      "2A": { status: "RAC 04 / RAC 02", count: 0, type: "RAC", color: "amber" },
      "3A": { status: "WL 24 / WL 12", count: 0, type: "WL", color: "red" },
      "SL": { status: "AVL 84", count: 84, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "12625",
    name: "Kerala Express",
    type: "Superfast Express",
    badgeColor: "#0b5345",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pantry: true,
    speedKmH: 74,
    stops: [
      { code: "ERS",  name: "Kochi Ernakulam Jn", day: 1, arr: "Source", dep: "14:20", km: 0 },
      { code: "TPTY", name: "Tirupati", day: 2, arr: "03:15", dep: "03:20", km: 740 },
      { code: "BZA",  name: "Vijayawada Jn", day: 2, arr: "10:15", dep: "10:30", km: 1120 },
      { code: "NDLS", name: "New Delhi", day: 3, arr: "13:40", dep: "Destination", km: 3036 }
    ],
    classes: ["2A", "3A", "SL"],
    baseFares: { "2A": 3680, "3A": 2490, "SL": 945 },
    availability: {
      "2A": { status: "AVL 08", count: 8, type: "AVAILABLE", color: "green" },
      "3A": { status: "AVL 31", count: 31, type: "AVAILABLE", color: "green" },
      "SL": { status: "AVL 115", count: 115, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "12863",
    name: "Howrah Express",
    type: "Superfast Express",
    badgeColor: "#78281f",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pantry: true,
    speedKmH: 68,
    stops: [
      { code: "HWH",  name: "Howrah Jn", day: 1, arr: "Source", dep: "20:35", km: 0 },
      { code: "VSKP", name: "Visakhapatnam", day: 2, arr: "11:00", dep: "11:20", km: 882 },
      { code: "BZA",  name: "Vijayawada Jn", day: 2, arr: "17:10", dep: "17:25", km: 1232 },
      { code: "TPTY", name: "Tirupati", day: 3, arr: "00:45", dep: "00:50", km: 1612 },
      { code: "SBC",  name: "KSR Bengaluru", day: 3, arr: "06:45", dep: "Destination", km: 1957 }
    ],
    classes: ["2A", "3A", "SL"],
    baseFares: { "2A": 3120, "3A": 2180, "SL": 830 },
    availability: {
      "2A": { status: "WL 08 / WL 03", count: 0, type: "WL", color: "red" },
      "3A": { status: "AVL 21", count: 21, type: "AVAILABLE", color: "green" },
      "SL": { status: "AVL 64", count: 64, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "12615",
    name: "Grand Trunk (GT) Express",
    type: "Superfast Express",
    badgeColor: "#154360",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pantry: true,
    speedKmH: 70,
    stops: [
      { code: "MAS",  name: "Chennai Central", day: 1, arr: "Source", dep: "18:50", km: 0 },
      { code: "GNT",  name: "Guntur Jn", day: 2, arr: "00:50", dep: "00:55", km: 395 },
      { code: "BZA",  name: "Vijayawada Jn", day: 2, arr: "01:50", dep: "02:05", km: 431 },
      { code: "NDLS", name: "New Delhi", day: 3, arr: "06:35", dep: "Destination", km: 2182 }
    ],
    classes: ["1A", "2A", "3A", "SL"],
    baseFares: { "1A": 5100, "2A": 3020, "3A": 2120, "SL": 810 },
    availability: {
      "1A": { status: "AVL 05", count: 5, type: "AVAILABLE", color: "green" },
      "2A": { status: "AVL 14", count: 14, type: "AVAILABLE", color: "green" },
      "3A": { status: "AVL 48", count: 48, type: "AVAILABLE", color: "green" },
      "SL": { status: "RAC 22 / RAC 16", count: 0, type: "RAC", color: "amber" }
    }
  },
  {
    number: "12028",
    name: "Shatabdi Express",
    type: "Shatabdi Express",
    badgeColor: "#935116",
    runningDays: ["Mon", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pantry: true,
    speedKmH: 82,
    stops: [
      { code: "SBC",  name: "KSR Bengaluru", day: 1, arr: "Source", dep: "06:00", km: 0 },
      { code: "MAS",  name: "Chennai Central", day: 1, arr: "11:00", dep: "Destination", km: 359 }
    ],
    classes: ["CC", "EC"],
    baseFares: { "CC": 985, "EC": 1950 },
    availability: {
      "CC": { status: "AVL 76", count: 76, type: "AVAILABLE", color: "green" },
      "EC": { status: "AVL 12", count: 12, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "20833",
    name: "Vande Bharat Express",
    type: "Vande Bharat Express",
    badgeColor: "#e67e22",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    pantry: true,
    speedKmH: 95,
    stops: [
      { code: "VSKP", name: "Visakhapatnam", day: 1, arr: "Source", dep: "05:45", km: 0 },
      { code: "BZA",  name: "Vijayawada Jn", day: 1, arr: "09:50", dep: "09:55", km: 350 },
      { code: "GNT",  name: "Guntur Jn", day: 1, arr: "10:30", dep: "10:35", km: 382 },
      { code: "SC",   name: "Secunderabad Jn", day: 1, arr: "14:15", dep: "Destination", km: 699 }
    ],
    classes: ["CC", "EC"],
    baseFares: { "CC": 1665, "EC": 3120 },
    availability: {
      "CC": { status: "AVL 54", count: 54, type: "AVAILABLE", color: "green" },
      "EC": { status: "AVL 08", count: 8, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "20607",
    name: "Chennai - Mysuru Vande Bharat",
    type: "Vande Bharat Express",
    badgeColor: "#e67e22",
    runningDays: ["Mon", "Tue", "Thu", "Fri", "Sat", "Sun"],
    pantry: true,
    speedKmH: 92,
    stops: [
      { code: "MAS",  name: "Chennai Central", day: 1, arr: "Source", dep: "05:50", km: 0 },
      { code: "SBC",  name: "KSR Bengaluru", day: 1, arr: "10:20", dep: "10:25", km: 359 },
      { code: "MYS",  name: "Mysuru Jn", day: 1, arr: "12:20", dep: "Destination", km: 497 }
    ],
    classes: ["CC", "EC"],
    baseFares: { "CC": 1365, "EC": 2485 },
    availability: {
      "CC": { status: "AVL 92", count: 92, type: "AVAILABLE", color: "green" },
      "EC": { status: "AVL 15", count: 15, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "12759",
    name: "Charminar Superfast Express",
    type: "Superfast Express",
    badgeColor: "#4a235a",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pantry: true,
    speedKmH: 70,
    stops: [
      { code: "MAS",  name: "Chennai Central", day: 1, arr: "Source", dep: "17:30", km: 0 },
      { code: "BZA",  name: "Vijayawada Jn", day: 2, arr: "00:40", dep: "00:50", km: 431 },
      { code: "SC",   name: "Secunderabad Jn", day: 2, arr: "06:35", dep: "06:40", km: 780 },
      { code: "HYB",  name: "Hyderabad Deccan", day: 2, arr: "07:15", dep: "Destination", km: 790 }
    ],
    classes: ["1A", "2A", "3A", "SL", "2S"],
    baseFares: { "1A": 2740, "2A": 1620, "3A": 1145, "SL": 440, "2S": 260 },
    availability: {
      "1A": { status: "AVL 03", count: 3, type: "AVAILABLE", color: "green" },
      "2A": { status: "AVL 19", count: 19, type: "AVAILABLE", color: "green" },
      "3A": { status: "AVL 62", count: 62, type: "AVAILABLE", color: "green" },
      "SL": { status: "AVL 140", count: 140, type: "AVAILABLE", color: "green" },
      "2S": { status: "AVL 80", count: 80, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "12795",
    name: "Intercity Express",
    type: "Superfast Intercity",
    badgeColor: "#1b4f72",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pantry: false,
    speedKmH: 76,
    stops: [
      { code: "BZA",  name: "Vijayawada Jn", day: 1, arr: "Source", dep: "05:30", km: 0 },
      { code: "GNT",  name: "Guntur Jn", day: 1, arr: "06:10", dep: "06:15", km: 32 },
      { code: "SC",   name: "Secunderabad Jn", day: 1, arr: "10:45", dep: "Destination", km: 349 }
    ],
    classes: ["CC", "2S"],
    baseFares: { "CC": 540, "2S": 165 },
    availability: {
      "CC": { status: "AVL 68", count: 68, type: "AVAILABLE", color: "green" },
      "2S": { status: "AVL 145", count: 145, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "12951",
    name: "Mumbai Tejas Rajdhani Express",
    type: "Rajdhani Express",
    badgeColor: "#b03a2e",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pantry: true,
    speedKmH: 90,
    stops: [
      { code: "MMCT", name: "Mumbai Central", day: 1, arr: "Source", dep: "17:00", km: 0 },
      { code: "NDLS", name: "New Delhi", day: 2, arr: "08:32", dep: "Destination", km: 1386 }
    ],
    classes: ["1A", "2A", "3A"],
    baseFares: { "1A": 4850, "2A": 2980, "3A": 2150 },
    availability: {
      "1A": { status: "AVL 06", count: 6, type: "AVAILABLE", color: "green" },
      "2A": { status: "AVL 28", count: 28, type: "AVAILABLE", color: "green" },
      "3A": { status: "AVL 85", count: 85, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "12301",
    name: "Howrah Rajdhani Express",
    type: "Rajdhani Express",
    badgeColor: "#b03a2e",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    pantry: true,
    speedKmH: 88,
    stops: [
      { code: "HWH",  name: "Howrah Jn", day: 1, arr: "Source", dep: "16:50", km: 0 },
      { code: "PNBE", name: "Patna Jn", day: 1, arr: "22:45", dep: "22:55", km: 535 },
      { code: "NDLS", name: "New Delhi", day: 2, arr: "10:05", dep: "Destination", km: 1450 }
    ],
    classes: ["1A", "2A", "3A"],
    baseFares: { "1A": 5050, "2A": 3120, "3A": 2230 },
    availability: {
      "1A": { status: "AVL 04", count: 4, type: "AVAILABLE", color: "green" },
      "2A": { status: "RAC 06 / RAC 02", count: 0, type: "RAC", color: "amber" },
      "3A": { status: "AVL 44", count: 44, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "12123",
    name: "Deccan Queen Express",
    type: "Superfast Express",
    badgeColor: "#117864",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pantry: true,
    speedKmH: 70,
    stops: [
      { code: "MMCT", name: "Mumbai Central", day: 1, arr: "Source", dep: "17:10", km: 0 },
      { code: "PUNE", name: "Pune Jn", day: 1, arr: "20:25", dep: "Destination", km: 192 }
    ],
    classes: ["CC", "2S"],
    baseFares: { "CC": 435, "2S": 125 },
    availability: {
      "CC": { status: "AVL 96", count: 96, type: "AVAILABLE", color: "green" },
      "2S": { status: "AVL 210", count: 210, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "12733",
    name: "Narayanadri Express",
    type: "Superfast Express",
    badgeColor: "#1b4f72",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pantry: false,
    speedKmH: 68,
    stops: [
      { code: "SC",   name: "Secunderabad Jn", day: 1, arr: "Source", dep: "18:05", km: 0 },
      { code: "GNT",  name: "Guntur Jn", day: 1, arr: "23:45", dep: "23:55", km: 281 },
      { code: "BZA",  name: "Vijayawada Jn", day: 2, arr: "00:45", dep: "00:55", km: 313 },
      { code: "TPTY", name: "Tirupati", day: 2, arr: "06:55", dep: "Destination", km: 700 }
    ],
    classes: ["1A", "2A", "3A", "SL"],
    baseFares: { "1A": 2550, "2A": 1520, "3A": 1080, "SL": 410 },
    availability: {
      "1A": { status: "AVL 03", count: 3, type: "AVAILABLE", color: "green" },
      "2A": { status: "AVL 15", count: 15, type: "AVAILABLE", color: "green" },
      "3A": { status: "AVL 58", count: 58, type: "AVAILABLE", color: "green" },
      "SL": { status: "AVL 92", count: 92, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "12707",
    name: "AP Sampark Kranti Express",
    type: "Sampark Kranti",
    badgeColor: "#7d6608",
    runningDays: ["Mon", "Wed", "Fri"],
    pantry: true,
    speedKmH: 78,
    stops: [
      { code: "TPTY", name: "Tirupati", day: 1, arr: "Source", dep: "05:30", km: 0 },
      { code: "BZA",  name: "Vijayawada Jn", day: 1, arr: "11:55", dep: "12:10", km: 380 },
      { code: "SC",   name: "Secunderabad Jn", day: 1, arr: "17:45", dep: "18:00", km: 729 },
      { code: "NDLS", name: "New Delhi", day: 2, arr: "18:00", dep: "Destination", km: 2380 }
    ],
    classes: ["1A", "2A", "3A", "SL"],
    baseFares: { "1A": 5350, "2A": 3150, "3A": 2220, "SL": 845 },
    availability: {
      "1A": { status: "WL 02 / WL 01", count: 0, type: "WL", color: "red" },
      "2A": { status: "AVL 11", count: 11, type: "AVAILABLE", color: "green" },
      "3A": { status: "AVL 34", count: 34, type: "AVAILABLE", color: "green" },
      "SL": { status: "AVL 68", count: 68, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "12656",
    name: "Navjeevan Superfast Express",
    type: "Superfast Express",
    badgeColor: "#196f3d",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pantry: true,
    speedKmH: 70,
    stops: [
      { code: "MAS",  name: "Chennai Central", day: 1, arr: "Source", dep: "10:10", km: 0 },
      { code: "BZA",  name: "Vijayawada Jn", day: 1, arr: "16:40", dep: "16:50", km: 431 },
      { code: "PUNE", name: "Pune Jn", day: 2, arr: "11:05", dep: "11:15", km: 1350 },
      { code: "MMCT", name: "Mumbai Central", day: 2, arr: "15:20", dep: "Destination", km: 1542 }
    ],
    classes: ["2A", "3A", "SL", "2S"],
    baseFares: { "2A": 2680, "3A": 1850, "SL": 710, "2S": 420 },
    availability: {
      "2A": { status: "AVL 14", count: 14, type: "AVAILABLE", color: "green" },
      "3A": { status: "AVL 46", count: 46, type: "AVAILABLE", color: "green" },
      "SL": { status: "RAC 15 / RAC 09", count: 0, type: "RAC", color: "amber" },
      "2S": { status: "AVL 52", count: 52, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "12393",
    name: "Sampoorna Kranti Express",
    type: "Superfast Express",
    badgeColor: "#6c3483",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pantry: true,
    speedKmH: 84,
    stops: [
      { code: "PNBE", name: "Patna Jn", day: 1, arr: "Source", dep: "19:25", km: 0 },
      { code: "NDLS", name: "New Delhi", day: 2, arr: "07:55", dep: "Destination", km: 1000 }
    ],
    classes: ["1A", "2A", "3A", "SL"],
    baseFares: { "1A": 3650, "2A": 2240, "3A": 1580, "SL": 585 },
    availability: {
      "1A": { status: "AVL 08", count: 8, type: "AVAILABLE", color: "green" },
      "2A": { status: "AVL 24", count: 24, type: "AVAILABLE", color: "green" },
      "3A": { status: "AVL 78", count: 78, type: "AVAILABLE", color: "green" },
      "SL": { status: "AVL 180", count: 180, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "16345",
    name: "Netravati Express",
    type: "Express",
    badgeColor: "#2874a6",
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    pantry: true,
    speedKmH: 64,
    stops: [
      { code: "MMCT", name: "Mumbai Central", day: 1, arr: "Source", dep: "11:40", km: 0 },
      { code: "PUNE", name: "Pune Jn", day: 1, arr: "15:10", dep: "15:15", km: 192 },
      { code: "ERS",  name: "Kochi Ernakulam Jn", day: 2, arr: "18:05", dep: "Destination", km: 1530 }
    ],
    classes: ["2A", "3A", "SL"],
    baseFares: { "2A": 2720, "3A": 1880, "SL": 720 },
    availability: {
      "2A": { status: "AVL 16", count: 16, type: "AVAILABLE", color: "green" },
      "3A": { status: "AVL 42", count: 42, type: "AVAILABLE", color: "green" },
      "SL": { status: "AVL 105", count: 105, type: "AVAILABLE", color: "green" }
    }
  },
  {
    number: "12245",
    name: "Howrah - Yesvantpur Duronto",
    type: "Duronto Express",
    badgeColor: "#1e8449",
    runningDays: ["Tue", "Wed", "Fri", "Sun"],
    pantry: true,
    speedKmH: 80,
    stops: [
      { code: "HWH",  name: "Howrah Jn", day: 1, arr: "Source", dep: "10:50", km: 0 },
      { code: "VSKP", name: "Visakhapatnam", day: 1, arr: "22:15", dep: "22:35", km: 882 },
      { code: "BZA",  name: "Vijayawada Jn", day: 2, arr: "04:30", dep: "04:45", km: 1232 },
      { code: "SBC",  name: "KSR Bengaluru", day: 2, arr: "16:00", dep: "Destination", km: 1945 }
    ],
    classes: ["1A", "2A", "3A", "SL"],
    baseFares: { "1A": 4980, "2A": 3050, "3A": 2180, "SL": 860 },
    availability: {
      "1A": { status: "AVL 04", count: 4, type: "AVAILABLE", color: "green" },
      "2A": { status: "AVL 18", count: 18, type: "AVAILABLE", color: "green" },
      "3A": { status: "AVL 56", count: 56, type: "AVAILABLE", color: "green" },
      "SL": { status: "AVL 110", count: 110, type: "AVAILABLE", color: "green" }
    }
  }
];

// Helper to calculate route segments & dynamic train matching
function findTrainsForRoute(fromCode, toCode) {
  const matchingTrains = [];

  TRAIN_DATABASE.forEach(train => {
    const fromIndex = train.stops.findIndex(s => s.code === fromCode);
    const toIndex = train.stops.findIndex(s => s.code === toCode);

    // Origin must come before destination in stops array
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
      const originStop = train.stops[fromIndex];
      const destStop = train.stops[toIndex];
      const distanceKm = Math.abs(destStop.km - originStop.km) || 350;

      // Calculate approximate travel duration in hours and minutes
      const hours = Math.floor(distanceKm / train.speedKmH);
      const minutes = Math.round(((distanceKm / train.speedKmH) - hours) * 60);
      const durationStr = `${hours}h ${minutes < 10 ? '0' : ''}${minutes}m`;

      // Scale fares based on actual distance
      const scaledFares = {};
      const classAvailability = {};

      train.classes.forEach(cls => {
        let kmRate = 0.6;
        if (cls === "1A") kmRate = 3.2;
        else if (cls === "2A") kmRate = 2.0;
        else if (cls === "3A") kmRate = 1.35;
        else if (cls === "CC") kmRate = 1.15;
        else if (cls === "EC") kmRate = 2.4;
        else if (cls === "2S") kmRate = 0.35;
        else kmRate = 0.55; // SL

        const calculatedFare = Math.round(150 + (distanceKm * kmRate));
        scaledFares[cls] = calculatedFare;

        // Clone base availability or generate consistent dynamic availability
        if (train.availability && train.availability[cls]) {
          classAvailability[cls] = { ...train.availability[cls] };
        } else {
          classAvailability[cls] = {
            status: "AVL 36",
            count: 36,
            type: "AVAILABLE",
            color: "green"
          };
        }
      });

      matchingTrains.push({
        ...train,
        fromStop: originStop,
        toStop: destStop,
        distanceKm,
        durationStr,
        scaledFares,
        dynamicAvailability: classAvailability
      });
    }
  });

  // If no direct train found between any two arbitrary stations in our sample,
  // generate a realistic connected Superfast Express so the simulator is 100% playable for ANY station pair!
  if (matchingTrains.length === 0) {
    const fromStation = STATIONS.find(s => s.code === fromCode);
    const toStation = STATIONS.find(s => s.code === toCode);

    if (fromStation && toStation) {
      // Mock generated special superfast
      const distanceKm = 680;
      matchingTrains.push({
        number: "08571",
        name: `${fromStation.city} - ${toStation.city} Special Superfast`,
        type: "Special Express",
        badgeColor: "#1b4f72",
        runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        pantry: true,
        speedKmH: 72,
        stops: [
          { code: fromCode, name: fromStation.name, day: 1, arr: "Source", dep: "08:15", km: 0 },
          { code: toCode,   name: toStation.name, day: 1, arr: "18:45", dep: "Destination", km: distanceKm }
        ],
        classes: ["2A", "3A", "SL", "2S"],
        fromStop: { code: fromCode, name: fromStation.name, dep: "08:15", arr: "Source" },
        toStop: { code: toCode, name: toStation.name, dep: "Destination", arr: "18:45" },
        distanceKm,
        durationStr: "10h 30m",
        scaledFares: { "2A": 1650, "3A": 1180, "SL": 440, "2S": 260 },
        dynamicAvailability: {
          "2A": { status: "AVL 14", count: 14, type: "AVAILABLE", color: "green" },
          "3A": { status: "AVL 48", count: 48, type: "AVAILABLE", color: "green" },
          "SL": { status: "RAC 12 / RAC 08", count: 0, type: "RAC", color: "amber" },
          "2S": { status: "AVL 92", count: 92, type: "AVAILABLE", color: "green" }
        }
      });

      // Second train option
      matchingTrains.push({
        number: "07429",
        name: `Bharat Gaurav ${toStation.city} Express`,
        type: "Superfast Express",
        badgeColor: "#b03a2e",
        runningDays: ["Daily"],
        pantry: true,
        speedKmH: 78,
        stops: [
          { code: fromCode, name: fromStation.name, day: 1, arr: "Source", dep: "20:30", km: 0 },
          { code: toCode,   name: toStation.name, day: 2, arr: "06:10", dep: "Destination", km: distanceKm }
        ],
        classes: ["1A", "2A", "3A", "SL"],
        fromStop: { code: fromCode, name: fromStation.name, dep: "20:30", arr: "Source" },
        toStop: { code: toCode, name: toStation.name, dep: "Destination", arr: "06:10" },
        distanceKm,
        durationStr: "9h 40m",
        scaledFares: { "1A": 2850, "2A": 1720, "3A": 1210, "SL": 460 },
        dynamicAvailability: {
          "1A": { status: "AVL 04", count: 4, type: "AVAILABLE", color: "green" },
          "2A": { status: "WL 05 / WL 02", count: 0, type: "WL", color: "red" },
          "3A": { status: "AVL 28", count: 28, type: "AVAILABLE", color: "green" },
          "SL": { status: "AVL 76", count: 76, type: "AVAILABLE", color: "green" }
        }
      });
    }
  }

  return matchingTrains;
}

// Visual Coach Berth Matrix Generator
function generateCoachLayout(travelClass, coachNumber = "B3") {
  // Sleeper & 3A layout: 8 bays of 8 berths = 64-72 berths
  // Lower (LB), Middle (MB), Upper (UB), Side Lower (SL), Side Upper (SU)
  if (travelClass === "SL" || travelClass === "3A") {
    const bays = [];
    const totalBays = travelClass === "3A" ? 8 : 9; // 64 or 72 berths
    let seatNum = 1;

    for (let b = 1; b <= totalBays; b++) {
      const bay = {
        bayNumber: b,
        compartmentBerths: [
          { number: seatNum++, type: "LB", label: "Lower", status: (seatNum % 4 === 0) ? "booked" : "available" },
          { number: seatNum++, type: "MB", label: "Middle", status: (seatNum % 3 === 0) ? "booked" : "available" },
          { number: seatNum++, type: "UB", label: "Upper", status: "available" },
          { number: seatNum++, type: "LB", label: "Lower", status: (seatNum % 5 === 0) ? "booked" : "available" },
          { number: seatNum++, type: "MB", label: "Middle", status: "available" },
          { number: seatNum++, type: "UB", label: "Upper", status: (seatNum % 7 === 0) ? "booked" : "available" }
        ],
        sideBerths: [
          { number: seatNum++, type: "SL", label: "Side Lower", status: (seatNum % 6 === 0) ? "booked" : "available" },
          { number: seatNum++, type: "SU", label: "Side Upper", status: "available" }
        ]
      };
      bays.push(bay);
    }
    return { type: "compartment", bays, coachNumber, className: travelClass === "3A" ? "AC 3-Tier" : "Sleeper Class" };
  }

  // 2A layout: 2-tier (No middle berth)
  if (travelClass === "2A") {
    const bays = [];
    const totalBays = 8; // 48-54 berths
    let seatNum = 1;

    for (let b = 1; b <= totalBays; b++) {
      const bay = {
        bayNumber: b,
        compartmentBerths: [
          { number: seatNum++, type: "LB", label: "Lower", status: (seatNum % 3 === 0) ? "booked" : "available" },
          { number: seatNum++, type: "UB", label: "Upper", status: "available" },
          { number: seatNum++, type: "LB", label: "Lower", status: "available" },
          { number: seatNum++, type: "UB", label: "Upper", status: (seatNum % 4 === 0) ? "booked" : "available" }
        ],
        sideBerths: [
          { number: seatNum++, type: "SL", label: "Side Lower", status: "available" },
          { number: seatNum++, type: "SU", label: "Side Upper", status: (seatNum % 5 === 0) ? "booked" : "available" }
        ]
      };
      bays.push(bay);
    }
    return { type: "compartment-2a", bays, coachNumber, className: "AC 2-Tier" };
  }

  // 1A layout: 4-berth cabins & 2-berth coupes
  if (travelClass === "1A") {
    const cabins = [];
    let seatNum = 1;
    for (let c = 1; c <= 4; c++) {
      cabins.push({
        name: `Cabin ${String.fromCharCode(64 + c)} (4 Berth)`,
        berths: [
          { number: seatNum++, type: "LB", label: "Cabin Lower", status: "available" },
          { number: seatNum++, type: "UB", label: "Cabin Upper", status: "available" },
          { number: seatNum++, type: "LB", label: "Cabin Lower", status: (c === 2) ? "booked" : "available" },
          { number: seatNum++, type: "UB", label: "Cabin Upper", status: "available" }
        ]
      });
    }
    for (let cp = 1; cp <= 3; cp++) {
      cabins.push({
        name: `Coupe ${cp} (2 Berth)`,
        berths: [
          { number: seatNum++, type: "LB", label: "Coupe Lower", status: "available" },
          { number: seatNum++, type: "UB", label: "Coupe Upper", status: (cp === 1) ? "booked" : "available" }
        ]
      });
    }
    return { type: "first-ac", cabins, coachNumber, className: "AC First Class (1A)" };
  }

  // Chair Car (CC / 2S)
  const rows = [];
  const totalRows = travelClass === "EC" ? 12 : 16;
  let seatCounter = 1;

  for (let r = 1; r <= totalRows; r++) {
    const leftSide = [];
    const rightSide = [];

    if (travelClass === "EC") {
      // 2x2 executive seating
      leftSide.push({ number: seatCounter++, type: "W", label: "Window", status: (seatCounter % 5 === 0) ? "booked" : "available" });
      leftSide.push({ number: seatCounter++, type: "A", label: "Aisle", status: "available" });
      rightSide.push({ number: seatCounter++, type: "A", label: "Aisle", status: "available" });
      rightSide.push({ number: seatCounter++, type: "W", label: "Window", status: (seatCounter % 4 === 0) ? "booked" : "available" });
    } else {
      // 3x2 standard chair car
      leftSide.push({ number: seatCounter++, type: "W", label: "Window", status: (seatCounter % 6 === 0) ? "booked" : "available" });
      leftSide.push({ number: seatCounter++, type: "M", label: "Middle", status: "available" });
      leftSide.push({ number: seatCounter++, type: "A", label: "Aisle", status: "available" });
      rightSide.push({ number: seatCounter++, type: "A", label: "Aisle", status: (seatCounter % 7 === 0) ? "booked" : "available" });
      rightSide.push({ number: seatCounter++, type: "W", label: "Window", status: "available" });
    }

    rows.push({ rowNumber: r, left: leftSide, right: rightSide });
  }

  return {
    type: "chair-car",
    rows,
    coachNumber: coachNumber || (travelClass === "EC" ? "E1" : "C2"),
    className: travelClass === "EC" ? "Executive Anubhuti Chair Car" : "AC Chair Car"
  };
}

// Export to window
if (typeof window !== "undefined") {
  window.STATIONS = STATIONS;
  window.TRAIN_DATABASE = TRAIN_DATABASE;
  window.findTrainsForRoute = findTrainsForRoute;
  window.generateCoachLayout = generateCoachLayout;
}
