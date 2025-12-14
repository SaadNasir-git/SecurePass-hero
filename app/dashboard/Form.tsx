'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Eye, EyeClosed , Plus } from 'lucide-react'
import React, { useState, useEffect, SetStateAction } from 'react'
import { toast } from 'react-toastify'
import axios, { AxiosError } from 'axios'
// import { savepassword, handleUpdate } from '@/actions/route'

// Form schema with validation
const formSchema = z.object({
  id: z.string().optional(),
  siteUrl: z.string().url({ message: 'Please enter a valid URL' }),
  username: z.string().min(2, { message: 'Username must be at least 2 characters' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
})

type FormData = z.infer<typeof formSchema>

interface PasswordFormProps {
  formData: {
    id?: string
    siteUrl: string
    username: string
    password: string
  }
  setFormData: React.Dispatch<React.SetStateAction<data>>
  encryptionPassword: string
  isLoading: boolean
  passwords: data[]
  setPassword: React.Dispatch<SetStateAction<data[]>>
}

export default function PasswordForm({
  formData,
  setFormData,
  encryptionPassword,
  isLoading,
  passwords,
  setPassword
}: PasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteUrl: formData.siteUrl,
      username: formData.username,
      password: formData.password
    }
  })

  // Update form values when formData changes
  useEffect(() => {
    form.reset({
      id: formData.id,
      siteUrl: formData.siteUrl,
      username: formData.username,
      password: formData.password
    })
  }, [formData, form])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    form.setValue(name as keyof FormData, value)
  }

  const onSubmit = async (data: FormData) => {
    try {
      if (data.id) {
        axios.post('/api/updatePassword', { object: data, password: encryptionPassword })
        form.reset({
          siteUrl: '',
          username: '',
          password: ''
        })
        setPassword([...passwords, { password: data.password, siteUrl: data.siteUrl, username: data.username, id: data.id }])
        toast.success('Password has been updated successfully')
        return
      }
      if (!data.password || !data.siteUrl || !data.username) {
        toast.error('All data is required')
        return
      }
      setIsSubmitting(true)
      const res = await axios.post('/api/savepassword', { username: data.username, siteUrl: data.siteUrl, password: data.password, key: encryptionPassword })
      if (res.status == 200) {
        setPassword([...passwords, { password: data.password, siteUrl: data.siteUrl, username: data.username, id: res.data.id }])
        form.reset()
        toast.success(res.data.message)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        {/* Website URL Field */}
        <FormField
          control={form.control}
          name="siteUrl"
          render={({ field }) => (
            <FormItem>
              <label htmlFor="site" className="sr-only">Website URL</label>
              <FormControl>
                <Input
                  type="url"
                  id="site"
                  placeholder="Enter website URL"
                  className="rounded-full border border-green-500 w-full p-4 py-1 my-4"
                  {...field}
                  onChange={handleChange}
                  readOnly={isSubmitting}
                  required
                />
              </FormControl>
              <FormMessage className="text-slate-600 dark:text-slate-400 text-sm" />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4 md:flex-row">
          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <label htmlFor="username" className="sr-only">Username</label>
                <FormControl>
                  <Input
                    type="text"
                    id="username"
                    placeholder="Enter username"
                    className="rounded-full border border-green-500 w-full p-4 py-1"
                    {...field}
                    onChange={handleChange}
                    readOnly={isSubmitting}
                    required
                  />
                </FormControl>
                <FormMessage className="text-slate-600 dark:text-slate-400 text-sm" />
              </FormItem>
            )}
          />

          {/* Password Field with Toggle */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="h-max w-full relative">
                  <label htmlFor="password" className="sr-only">Password</label>
                  <FormControl>
                    <Input
                      id="password"
                      placeholder="Enter password"
                      type={showPassword ? "text" : "password"}
                      className="rounded-full border border-green-500 w-full p-4 py-1 pr-12"
                      {...field}
                      onChange={handleChange}
                      readOnly={isSubmitting}
                      required
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute top-1/2 right-3 -translate-y-1/2 h-8 w-8 p-0"
                  >
                    {showPassword ? (
                      <EyeClosed className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <FormMessage className="text-slate-600 dark:text-slate-400 text-sm" />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || isSubmitting || !encryptionPassword}
          className="disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center gap-1.5 bg-green-500 w-max py-1 px-4 rounded-full mx-auto mt-5 cursor-pointer"
        >
          <Plus width={30} height={30}/>
          <span className="font-bold text-white">
            {isSubmitting ? "Processing..." : formData.id ? "Update" : "Save"}
          </span>
        </Button>
      </form>
    </Form>
  )
}