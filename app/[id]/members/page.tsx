'use client';

import React from 'react';
import { Members } from '../../../components';

export default function Page({ params }: { params: { id: string } }) {
    return <Members {...params} />
}


