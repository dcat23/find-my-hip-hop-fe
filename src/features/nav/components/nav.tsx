"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Edit3,
  Globe,
  Layout,
  LayoutDashboard,
  Megaphone,
  Menu,
  Newspaper,
  Settings,
  FileCode,
  Github,
  MessageCircle,
  BookOpenText,
  MessageSquare,
  Tv2,
  Lightbulb,
  MonitorPlay,
  Presentation,
} from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { getTeamFromNote } from "@dcat23/features/team";

const externalLinks = [
  {
    name: "Discord",
    href: "https://discord.com/",
    icon: <MessageCircle width={18} />,
  },
  {
    name: "Microsoft Teams",
    href: "https://teams.microsoft.com/",
    icon: <Layout width={18} />,
  },
  {
    name: "Star on GitHub",
    href: "https://github.com/dcat23",
    icon: <Github width={18} />,
  },
  {
    name: "Documentation",
    href: "https://docs.localhost:3000",
    icon: <BookOpenText width={18} />,
  },
  {
    name: "Feedback",
    href: "https://app.localhost:3000/feedback",
    icon: <MessageSquare width={18} />,
  },
];

export function Nav({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const [teamId, setTeamId] = useState<string | null>();

  useEffect(() => {
    if (segments[0] === "note" && id) {
      getTeamFromNote(id).then((id) => {
        setTeamId(id);
      });
    }
  }, [segments, id]);

  const tabs = useMemo(() => {
    if (segments[0] === "team" && id) {
      return [
        {
          name: "Back to All Teams",
          href: "/teams",
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Notes",
          href: `/team/${id}`,
          isActive: segments.length === 2,
          icon: <Newspaper width={18} />,
        },
        {
          name: "Analytics",
          href: `/team/${id}/analytics`,
          isActive: segments.includes("analytics"),
          icon: <BarChart3 width={18} />,
        },
        {
          name: "Settings",
          href: `/team/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    } else if (segments[0] === "note" && id) {
      return [
        {
          name: "Back to All Notes",
          href: teamId ? `/team/${teamId}` : "/teams",
          icon: <ArrowLeft width={18} />,
        },
        {
          name: "Editor",
          href: `/note/${id}`,
          isActive: segments.length === 2,
          icon: <Edit3 width={18} />,
        },
        {
          name: "Settings",
          href: `/note/${id}/settings`,
          isActive: segments.includes("settings"),
          icon: <Settings width={18} />,
        },
      ];
    }
  //  else if (segments[0] === "lecture" && id) {
  //    return [
  //      {
  //        name: "Back to All Lectures",
  //        href: "/lectures",
  //        icon: <ArrowLeft width={18} />,
  //      },
  //      {
  //        name: "Notes",
  //        href: `/lectures/${id}`,
  //        isActive: segments.length === 2,
  //        icon: <Newspaper width={18} />,
  //      },
  //      {
  //        name: "Analytics",
  //        href: `/lecture/${id}/analytics`,
  //        isActive: segments.includes("analytics"),
  //        icon: <BarChart3 width={18} />,
  //      },
  //      {
  //        name: "Settings",
  //        href: `/lecture/${id}/settings`,
  //        isActive: segments.includes("settings"),
  //        icon: <Settings width={18} />,
  //      },
  //    ];
  //  } else if (segments[0] === "topic" && id) {
  //    return [
  //      {
  //        name: "Back to All Topics",
  //        href: "/topics",
  //        icon: <ArrowLeft width={18} />,
  //      },
  //      {
  //        name: "Courses",
  //        href: `/topic/${id}`,
  //        isActive: segments.length === 2,
  //        icon: <Presentation width={18} />,
  //      },
  //      {
  //        name: "Media",
  //        href: `/topic/${id}/media`,
  //        isActive: segments.includes("media"),
  //        icon: <MonitorPlay width={18} />,
  //      },
  //      {
  //        name: "Analytics",
  //        href: `/topic/${id}/analytics`,
  //        isActive: segments.includes("analytics"),
  //        icon: <BarChart3 width={18} />,
  //      },
  //      {
  //        name: "Settings",
  //        href: `/topic/${id}/settings`,
  //        isActive: segments.includes("settings"),
  //        icon: <Settings width={18} />,
  //      },
  //    ];
  //  }
    return [
      {
        name: "Overview",
        href: "/",
        isActive: segments.length === 0,
        icon: <LayoutDashboard width={18} />,
      },
      {
        name: "Teams",
        href: "/teams",
        isActive: segments[0] === "teams",
        icon: <Layout width={18} />,
      },
    //  {
    //    name: "Topics",
    //    href: "/topics",
    //    isActive: segments[0] === "topics",
    //    icon: <Lightbulb width={18} />,
    //  },
    //  {
    //    name: "Lectures",
    //    href: "/lectures",
    //    isActive: segments[0] === "lectures",
    //    icon: <Tv2 width={18} />,
    //  },
      {
        name: "Settings",
        href: "/settings",
        isActive: segments[0] === "settings",
        icon: <Settings width={18} />,
      },
    ];
  }, [segments, id, teamId]);

  const [showSidebar, setShowSidebar] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // hide sidebar on path change
    setShowSidebar(false);
  }, [pathname]);

  return (
    <>
      <button
        className={`fixed z-20 ${
          // left align for Editor, right align for other pages
          segments[0] === "note" && segments.length === 2 && !showSidebar
            ? "left-5 top-5"
            : "right-5 top-7"
        } sm:hidden`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>
      <div
        className={`transform ${
          showSidebar ? "w-full translate-x-0" : "-translate-x-full"
        } fixed z-10 flex h-full flex-col justify-between border-r border-stone-200 bg-stone-100 p-4 transition-all sm:w-60 sm:translate-x-0 dark:border-stone-700 dark:bg-stone-900`}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700"
            >
              <svg
                width="26"
                viewBox="0 0 76 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-black dark:text-white"
              >
                <path
                  d="M37.5274 0L75.0548 65H0L37.5274 0Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <div className="h-6 rotate-[30deg] border-l border-stone-400 dark:border-stone-500" />
            <Link
              href="/"
              className="rounded-lg p-2 hover:bg-stone-200 dark:hover:bg-stone-700"
            >
              <Image
                src="/logo.png"
                width={24}
                height={24}
                alt="Logo"
                className="dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
              />
            </Link>
          </div>
          <div className="grid gap-1">
            {tabs.map(({ name, href, isActive, icon }) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center space-x-3 ${
                  isActive ? "bg-stone-200 text-black dark:bg-stone-700" : ""
                } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
              >
                {icon}
                <span className="text-sm font-medium">{name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="grid gap-1">
            {externalLinks.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
              >
                <div className="flex items-center space-x-3">
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                </div>
                <p>↗</p>
              </a>
            ))}
          </div>
          <div className="my-2 border-t border-stone-200 dark:border-stone-700" />
          {children}
        </div>
      </div>
    </>
  );
}
