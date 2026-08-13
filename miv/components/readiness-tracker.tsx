import React from "react";

export default function ReadinessTracker() {
	return (
		<div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
			{/* Header */}
			<h1 className="text-2xl font-semibold mb-4">Readiness Tracker</h1>
			<p className="mb-6 text-sm text-muted-foreground">
				2 of 10 tasks completed
			</p>

			{/* Checklist Items */}
			<ul className="space-y-2">
				<li className="flex items-center justify-between">
					<span>NDA Signed</span>
					<span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
						Done
					</span>
				</li>
				<li className="flex items-center justify-between">
					<span>Financial Statements Uploaded</span>
					<span className="rounded-full bg-warning/10 px-2 py-1 text-xs font-medium text-warning">
						In Progress
					</span>
				</li>
				<li className="flex items-center justify-between">
					<span>Pitch Deck Ready</span>
					<span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
						Not Started
					</span>
				</li>
			</ul>

			{/* Attachments Placeholder */}
			<div className="mt-6 rounded-md border-2 border-dashed border-border p-6 text-center">
				<p className="text-muted-foreground">No documents uploaded yet</p>
				<p className="mt-1 text-xs text-muted-foreground">
					Upload a file or drag and drop • PNG, JPG, GIF up to 10MB
				</p>
			</div>

			{/* Add Tag Button */}
			<div className="mt-6 flex space-x-2">
				<button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
					Add More Tag
				</button>
			</div>
		</div>
	);
}
