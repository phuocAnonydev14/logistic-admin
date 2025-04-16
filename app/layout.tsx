import type React from "react";
import type {Metadata} from "next";
import {Inter} from "next/font/google";

import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "@/components/ui/sonner"
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
	title: "Admin Dashboard",
	description: "Admin dashboard with multilingual support",
	generator: "v0.dev",
};

export default function RootLayout({
																		 children,
																	 }: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
		<body className={inter.className}>
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			disableTransitionOnChange
		>
			<Toaster/>
			{children}
		</ThemeProvider>
		</body>
		</html>
	);
}

import "./globals.css";
