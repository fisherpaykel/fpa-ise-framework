'use client';
import PageNotFound from './components/PageNotFound'; // Error components must be Client components

export default function RootErrorBoundary() {
    return <PageNotFound />;
}
