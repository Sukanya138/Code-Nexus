"use client"

import { useCurrentUser } from '@/hooks/use-auth'
import React, { useEffect } from 'react'

import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { setAuthCookie } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { RepoDashboard } from '@/components/dashboard/repo-dashboard'

const DashboardPage = () => {
    const { data: user, isLoading } = useCurrentUser()
    const router = useRouter()

    async function handleLogout() {
        // Open GitHub logout in a new tab to let user sign out of provider
        try {
            const w = window.open('https://github.com/logout', '_blank', 'noopener,noreferrer')
            // call backend logout to clear server session
            await api.logout()
        } catch (e) {
            // ignore
        } finally {
            setAuthCookie(false)
            router.replace('/login')
        }
    }

    useEffect(() => {
        if (!isLoading && !user) {
            // defer navigation until after render
            router.replace('/login')
        }
    }, [isLoading, user, router])

    if (isLoading) {
        return <div className="p-8">Loading...</div>
    }

    if (!user) {
        return null
    }

    console.log(user,isLoading);

    return (
        <AppShell title="Overview" description="This is your CodeNexus workspace">
            <RepoDashboard/>
        </AppShell>
    )
}

export default DashboardPage