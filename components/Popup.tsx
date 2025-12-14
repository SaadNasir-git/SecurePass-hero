"use client";

import React, { useEffect, useState, ChangeEvent, SetStateAction } from "react";
import { handlecopy } from "@/lib/copy";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface SetPasswordProps {
  setshowpopup: (value: boolean) => void;
  setEncryption_Passord: React.Dispatch<SetStateAction<string>>;
  encryptionPassword: string;
  passwords: data[]
}

const SetPassword: React.FC<SetPasswordProps> = ({
  setshowpopup,
  setEncryption_Passord,
  encryptionPassword,
  passwords
}) => {
  const [Password, setPassword] = useState<string>("");
  const [Error, setError] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);
  const [Message] = useState<string>("The password is not correct Try again");
  const [forgot, setforgot] = useState<boolean>(false);
  const [showforgotPassword, setshowforgotPassword] = useState<boolean>(false);
  const lowercase = "abcdef";
  const num = "1234567890";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let pass = e.target.value;

    if (
      lowercase.includes(pass[pass.length - 1]) ||
      num.includes(pass[pass.length - 1]) ||
      !pass[pass.length - 1]
    ) {
      setPassword(e.target.value.trim());
      if (Error) {
        setError(false);
      }
    } else {
      setError(true);
    }
  };

  const handlesave = async () => {
    try {
      setloading(true)
      const res = await axios.post('/api/changePassword', { newPassword: Password, oldPassword: encryptionPassword || Password })
      if (res.data.isValid) {
        localStorage.setItem("encryption_key", Password);
        setEncryption_Passord(Password)
        setshowpopup(false)
      } else {
        toast.error('Provided Password is inCorrect');
        setforgot(true)
      }
    } catch (error) {
      toast.error('An unexpected error has been occurred')
    } finally {
      setloading(false)
    }
  };

  const GeneratePassword = () => {
    let all = lowercase + num;
    let password = "";
    for (let i = 0; i < 64; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    password = password
      .split("")
      .sort(() => {
        return Math.random() - 0.5;
      })
      .join("");
    setPassword(password);
  };

  const handleForgotPassword = async () => {
    setloading(true);
    await axios.get('/api/deletePasswords')
    setforgot(false);
    setshowforgotPassword(false);
    setloading(false);
  };

  useEffect(() => {
    if (Error) {
      const timer = setTimeout(() => {
        setError(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [Error]);

  return (
    <div className="fixed inset-0 z-[10] backdrop-blur-[2px] flex justify-center items-center p-4">
      <Card className="w-full max-w-md shadow-2xl mx-2 bg-slate-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold">
            <span className="text-green-500">&lt;</span>
            <span className="text-white">Secure</span>
            <span className="text-green-500">PASS/&gt;</span>
          </CardTitle>
          <p className="text-gray-300 text-sm md:text-base mt-1">
            Encryption Password
          </p>
        </CardHeader>

        <CardContent>
          {/* Password Input */}
          <div className="flex flex-col mb-4">
            <Label htmlFor="current_password" className="text-lg font-semibold mb-2 text-white">
              Enter Your Code
              {forgot && (
                <div className="text-red-500 text-sm font-normal mt-1">{Message}</div>
              )}
            </Label>
            <div className="flex gap-0">
              <Input
                type="text"
                id="current_password"
                className="bg-green-400 border-green-500 flex-grow rounded-r-none focus-visible:ring-green-500"
                value={Password}
                onChange={handleChange}
                readOnly={loading}
                minLength={64}
                maxLength={64}
                placeholder="Enter your 64-character password"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => handlecopy(Password)}
                disabled={Password.length === 0}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 rounded-l-none px-4"
              >
                <Copy />
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {Error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                The password can only contain numbers and abcdef
              </AlertDescription>
            </Alert>
          )}

          {/* Forgot Password */}
          {forgot && (
            <div className="text-center mb-4 z-[9999]">
              <p className="text-muted-foreground text-sm">
                Have you{" "}
                <Button
                  variant="link"
                  onClick={() => setshowforgotPassword(true)}
                  className="p-0 h-auto text-blue-400 hover:text-blue-300"
                >
                  forgotten your password?
                </Button>
              </p>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={GeneratePassword}
            variant="default"
            className="w-full hover:bg-green-600 bg-green-500 text-white mb-4 rounded-full"
          >
            Generate Password
          </Button>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">

            <Button
              onClick={handlesave}
              disabled={Password.length !== 64 || loading}
              className={`w-full ${Password.length === 64 && !loading
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-500"
                }`}
            >
              {loading ? "Processing..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Forgot Password Alert Dialog */}
      <AlertDialog open={showforgotPassword} onOpenChange={setshowforgotPassword}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-yellow-500">
              Alert!
            </AlertDialogTitle>
            <AlertDialogDescription>
              If you reset your password, all existing passwords in your manager
              will be deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleForgotPassword}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600"
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SetPassword;