'use client';

import React from 'react';
import { Resources } from '../../../components';

export default function Page({ params }: { params: { id: string } }) {
    return <Resources { ...params} />
}


